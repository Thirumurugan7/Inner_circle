import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import HelpAction from "../models/helpAction.model.js";
import Leaderboard from "../models/leaderboard.model.js";
import { encodeFunctionData } from "viem";

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
    helpedUser.isActive =
      helpedUser.pointsAllocated >= 25 && helpedUser.pointsReceived >= 15;

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

export const Aatest = async (req, res) => {
  const { to } = req.body;

  const abi =  [{
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_tokenURI",
          "type": "string"
        }
      ],
      "name": "safeMint",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },]


  const apiKey = "pim_UACBBfefRXFdpheZCcB6VV";
  if (!apiKey) throw new Error("Missing PIMLICO_API_KEY");

  const privateKey =
    "0xa27419eebd31cd9decd5b790b4ca294f46c1066aecf36c8e29cac784398eb530";

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http("https://base-sepolia.infura.io/v3/1b78687936a44910bb82d818d810485d"),
  });

const pimlicoUrl = `https://api.pimlico.io/v2/84532/rpc?apikey=pim_btPPGTjfxa6X6TW6MeogK9`;
// const pimlicoUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${apiKey}`;

  const pimlicoClient = createPimlicoClient({
    transport: http(pimlicoUrl),
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7",
    },
  });

  const account = await toSafeSmartAccount({
    client: publicClient,
    owners: [privateKeyToAccount(privateKey)],
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7",
    }, // global entrypoint
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




  const txHash = await smartAccountClient.sendTransaction({
    to: "0x42a8872d40349b6bE320E3cfDE9400C438891911",
    value: 0n,
    data: encodeFunctionData({
      abi: abi,
      functionName: "safeMint",
      args: [
        to, // Address to receive the minted tokens
        "https://blush-nursing-mandrill-661.mypinata.cloud/ipfs/bafkreiepqd6r6ow6xzneg5xgzu5taytj2zzvx62hwl2hmoz6ctqlqw3qde?pinataGatewayToken=mWGmzTdWTVYzmqOV8fjZkGTG7v-YKBgdzF8XJeeMGfo4_B5DGs4UbpjGfqyOevUS", // Amount to mint (use appropriate bigint value, e.g. 1000000000000000000n for 1 token with 18 decimals)
      ],
    }),
  });
  //  const receipt = await txHash.wait();
  // const nftMintedEvent = receipt.logs
  //   .filter(
  //     (log) => log.address.toLowerCase() === contractAddress.toLowerCase()
  //   )
  //   .map((log) => {
  //     try {
  //       return contract.interface.parseLog({
  //         topics: log.topics,
  //         data: log.data,
  //       });
  //     } catch (e) {
  //       return null;
  //     }
  //   })
  //   .find((event) => event && event.name === "NFTMinted");
  //    const tokenId = nftMintedEvent?.args[1]?.toString();
     console.log(txHash)
  console.log(
    `User operation included: https://sepolia.etherscan.io/tx/${txHash}`
  );

  return 0;
};
