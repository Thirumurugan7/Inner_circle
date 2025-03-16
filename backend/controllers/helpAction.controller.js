import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import HelpAction from "../models/helpAction.model.js";
import Leaderboard from "../models/leaderboard.model.js";
import { encodeFunctionData } from "viem";
import { gql, request } from "graphql-request";
import { reinstateUserSBT } from "../services/sbt.service.js";
import "dotenv/config";
import { writeFileSync } from "fs";
import { toSafeSmartAccount } from "permissionless/accounts";
import { createPublicClient, getContract, http } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { sepolia, baseSepolia } from "viem/chains";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import {
  createBundlerClient,
  entryPoint07Address,
} from "viem/account-abstraction";
import { createSmartAccountClient } from "permissionless";
export const allocatePoints = async (req, res) => {
  try {
    const { helpedForWallet, helpedByWallet, points, feedback, category } =
      req.body;
    const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer Token
    console.log(helpedForWallet, helpedByWallet, points, feedback, category);
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const helpedUserWallet = decoded.walletAddress; // The user who is allocating points

    // Fetch the users
    const helpedUser = await User.findOne({ walletAddress: helpedUserWallet }); // The one giving points
    const helpedBy = await User.findOne({ walletAddress: helpedByWallet }); // The one receiving points

    if (!helpedUser || !helpedBy) {
      return res.status(404).json({ success: false, message: "Invalid users" });
    }
    if (!helpedUser.isActive) {
      return res.status(403).json({
        success: false,
        message: "You can't allocate points because your account is not active",
      });
    }
    if (helpedUser.monthlyPoints < points) {
      return res
        .status(400)
        .json({ success: false, message: "Not enough points available" });
    }

    // Calculate the date 30 days ago from now
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Find help actions from this user to the recipient in the last 30 days
    const recentActions = await HelpAction.find({
      helpedUser: helpedUser._id,
      helpedBy: helpedBy._id,
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Calculate total points already allocated to this user in the last 30 days
    const pointsAlreadyAllocated = recentActions.reduce(
      (total, action) => total + action.pointsAllocated,
      0
    );

    // Check if allocating these points would exceed the 5-point limit
    if (pointsAlreadyAllocated + points > 5) {
      return res.status(400).json({
        success: false,
        message: `You can only allocate 5 points to each user within a 30-day period. You have already allocated ${pointsAlreadyAllocated} points to this user in the last 30 days.`,
      });
    }

    // Deduct points from the giver (helpedUser)
    helpedUser.monthlyPoints -= points;
    helpedUser.pointsAllocated += points;

    // Add points to the receiver (helpedBy)
    helpedBy.totalPoints += points;
    helpedBy.pointsReceived += points;

    // Update the receiver's data using `$inc` to prevent race conditions
    if (helpedBy.categoryContribution instanceof Map) {
      helpedBy.categoryContribution = Object.fromEntries(
        helpedBy.categoryContribution
      );
    }

    // Initialize category if missing
    if (
      !Object.prototype.hasOwnProperty.call(
        helpedBy.categoryContribution,
        category
      )
    ) {
      helpedBy.categoryContribution[category] = 0;
    }

    // Increment category contribution
    helpedBy.categoryContribution[category] += 1;

    // Mark categoryContribution as modified
    helpedBy.markModified("categoryContribution");

    // Increment `topcontribution`
    helpedBy.topcontribution += 1;

    // Save helpedBy user
    await helpedBy.save();

    // Debugging logs
    console.log("Updated categoryContribution:", helpedBy.categoryContribution);
    console.log("Updated topcontribution:", helpedBy.topcontribution);

    // Check if user remains active


    // Save both users
    await helpedUser.save();
    await helpedBy.save();

    // Create help action record
    await HelpAction.create({
      helpedBy: helpedBy._id, // The receiver
      helpedUser: helpedUser._id, // The giver
      pointsAllocated: points,
      feedback,
      category,
    });

    const leaderboardEntry = await Leaderboard.findOneAndUpdate(
      { user: helpedBy._id },
      {
        $inc: { totalPoints: points }, // Increment total points
        $push: { pointsHistory: { points, date: new Date() } }, // Add history
        lastUpdated: new Date(),
        lastActivity: category, // Add last activity as category
      },
      { upsert: true, new: true } // If not found, create a new entry
    );

    res.json({
      success: true,
      message: "Points allocated successfully",
      leaderboardEntry,
    });
  } catch (error) {
    console.error("Error in point allocation:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const getHelpActions = async (req, res) => {
  try {
    const { limit } = req.query; // Get limit from query params
    const recordsLimit = limit ? parseInt(limit) : 10; // Default limit = 10

    // Fetch help actions sorted by latest first
    const helpActions = await HelpAction.find()
      .sort({ createdAt: -1 }) // Latest first
      .limit(recordsLimit)
      .populate("helpedBy", "name") // Get only the name of helpedBy user
      .populate("helpedUser", "name") // Get only the name of helpedUser user
      .select("pointsAllocated category createdAt helpedBy helpedUser"); // Select required fields

    res.json({ success: true, data: helpActions });
  } catch (error) {
    console.error("Error fetching help actions:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const getHelpActionsByWalletAddress = async (req, res) => {
  try {
    console.log("Request Query Params:", req.query);
    const { walletAddress } = req.query;
    console.log(walletAddress);

    if (!walletAddress) {
      return res.status(400).json({ message: "Wallet address is required." });
    }

    // First find the user with the given wallet address
    const user = await User.findOne({ walletAddress }).exec();

    if (!user) {
      return res.json([]); // Return empty array if user not found
    }

    // Then find help actions where this user helped others
    const helpActions = await HelpAction.find({ helpedBy: user._id })
      .populate("helpedBy", "walletAddress name")
      .populate("helpedUser", "walletAddress name")
      .limit(5)
      .exec();

    res.json(helpActions);
  } catch (error) {
    console.error("Error fetching help actions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const { walletAddress } = req.query;
    console.log(walletAddress);

    // Fetch user details
    const user = await User.findOne({ walletAddress });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Extract topcontribution & totalPoints
    const { topcontribution, totalPoints, categoryContribution } = user;

    // Find category with maximum contribution
    let maxCategory = "None";
    let maxPoints = 0;

    if (categoryContribution && Object.keys(categoryContribution).length > 0) {
      Object.entries(categoryContribution).forEach(([category, points]) => {
        if (points > maxPoints) {
          maxPoints = points;
          maxCategory = category;
        }
      });
    }

    // Fetch the most recent HelpAction for the user
    const latestHelpAction = await HelpAction.findOne({ helpedBy: user._id })
      .sort({ createdAt: -1 }) // Get latest entry
      .populate("helpedBy", "walletAddress name"); // Populate helpedBy details

    // Extract helpedBy details along with pointsAllocated & category
    const helpActionData = latestHelpAction
      ? {
          helpedBy: latestHelpAction.helpedBy,
          pointsAllocated: latestHelpAction.pointsAllocated,
          category: latestHelpAction.category,
          createdAt: latestHelpAction.createdAt,
        }
      : null;

    // Send response
    res.json({
      success: true,
      data: {
        topcontribution,
        totalPoints,
        maxCategory,
        maxPoints,
        latestHelpAction: helpActionData, // Include latest help action details
      },
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const sbtmint = async (req, res) => {
  const { to } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (!to) {
    return res.status(400).json({ message: "Wallet address is required" });
  }

  // First, check if the address already has a minted token
  const existingTokenId = await fetchTokenIdForAddress(to);
  
  if (existingTokenId) {
    console.log(`Token already minted for address ${to}, token ID: ${existingTokenId}`);
    
    // Update user in DB with existing token ID
    const user = await User.findOneAndUpdate(
      { walletAddress: to },
      { minted: true, sbtId: existingTokenId },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User already had a minted token, database updated with existing token ID",
      user,
    });
  }

  // If no existing token found, proceed with minting...
  const abi = [
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "string",
          name: "_tokenURI",
          type: "string",
        },
      ],
      name: "safeMint",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const apiKey = process.env.PIMLICO_API_KEY;
  if (!apiKey) throw new Error("Missing PIMLICO_API_KEY");

  const privateKey = process.env.PRIVATE_KEY;
  const contractAddress = "0x6604938BE60a32EA9B4F0f12c25a89B14E9d1827";

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.INFURA_URL),
  });

  const pimlicoUrl = `https://api.pimlico.io/v2/84532/rpc?apikey=${apiKey}`;

  const pimlicoClient = createPimlicoClient({
    transport: http(pimlicoUrl),
    entryPoint: { address: entryPoint07Address, version: "0.7" },
  });

  const account = await toSafeSmartAccount({
    client: publicClient,
    owners: [privateKeyToAccount(privateKey)],
    entryPoint: { address: entryPoint07Address, version: "0.7" },
    version: "1.4.1",
  });

  console.log(
    `Smart account address: https://sepolia.basescan.io/address/${account.address}`
  );

  const smartAccountClient = createSmartAccountClient({
    account,
    chain: baseSepolia,
    bundlerTransport: http(pimlicoUrl),
    paymaster: pimlicoClient,
    userOperation: {
      estimateFeesPerGas: async () => {
        return (await pimlicoClient.getUserOperationGasPrice()).fast;
      },
    },
  });

  // 🔹 **Send Transaction**
  const txHash = await smartAccountClient.sendTransaction({
    to: contractAddress,
    value: 0n,
    data: encodeFunctionData({
      abi: abi,
      functionName: "safeMint",
      args: [
        to,
        "https://blush-nursing-mandrill-661.mypinata.cloud/ipfs/bafkreiepqd6r6ow6xzneg5xgzu5taytj2zzvx62hwl2hmoz6ctqlqw3qde",
      ],
    }),
  });

  console.log(`Transaction sent: https://sepolia.etherscan.io/tx/${txHash}`);

  // 🔹 **Wait for transaction confirmation**
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  if (!receipt) {
    return res.status(500).json({ message: "Transaction not confirmed" });
  }

  // 🔹 **Fetch Token ID after delay to ensure subgraph indexing**
  let sbtId = null;
  for (let i = 0; i < 5; i++) {
    sbtId = await fetchTokenIdForAddress(to);
    if (sbtId) break;
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 sec
  }

  if (!sbtId) {
    return res.status(404).json({ message: "SBT ID not found after minting" });
  }

  // 🔹 **Update user in DB**
  const user = await User.findOneAndUpdate(
    { walletAddress: to },
    { minted: true, sbtId },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({
    success: true,
    message: "Minted status updated",
    user,
  });
};

const fetchTokenIdForAddress = async (toAddress) => {
  try {
    // Normalize the address to lowercase to ensure consistent matching
    const normalizedAddress = toAddress.toLowerCase();

    const specificQuery = gql`
      {
        sbtMinteds(where: {to: "${normalizedAddress}"}) {
          id
          to
          tokenId
        }
      }
    `;

    const data = await request(url, specificQuery);

    if (!data || !data.sbtMinteds || data.sbtMinteds.length === 0) {
      console.log(`No token found for address ${normalizedAddress}`);
      return null;
    }

    console.log(
      `Found token for address ${normalizedAddress}: ${data.sbtMinteds[0].tokenId}`
    );
    return data.sbtMinteds[0].tokenId;
  } catch (error) {
    console.error("Error fetching token ID:", error);
    return null;
  }
};


const query = gql`
  {
    sbtMinteds {
      id
      to
      tokenId
    }
  }
`;
const url = "https://api.studio.thegraph.com/query/106616/ic/version/latest";

async function fetchSubgraphData() {
  return await request(url, query);
}




export const reclaimSBT = async (req, res) => {
  try {
    const { userId } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Verify user is authenticated and authorized
    // This depends on your auth system...

    // Find user
    const user = await User.findOne({ walletAddress: userId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if user has a revoked SBT
    if (!user.minted || !user.sbtId || !user.sbtRevoked) {
      return res.status(400).json({
        success: false,
        message: "No revoked SBT found for this user",
      });
    }

    

    // Update user record
    user.isActive = true;
    user.sbtRevoked = false;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "SBT successfully reclaimed",
      user
    });
  } catch (error) {
    console.error("Error reclaiming SBT:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reclaim SBT",
      error: error.message,
    });
  }
};
      