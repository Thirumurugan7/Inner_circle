import { encodeFunctionData } from "viem";

import "dotenv/config";
import { toSafeSmartAccount } from "permissionless/accounts";
import { createPublicClient, getContract, http } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { bsc } from "viem/chains";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import {
  createBundlerClient,
  entryPoint07Address,
} from "viem/account-abstraction";
import { createSmartAccountClient } from "permissionless";
import { keccak256, toBytes, decodeEventLog } from "viem";


export const sbtmint = async (req, res) => {
  const { to } = req.body;

  if (!to) {
    return res.status(400).json({ message: "Wallet address is required" });
  }


  // If no existing token found, proceed with minting...
  const abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "points",
          "type": "uint256"
        }
      ],
      "name": "claimPoints",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newPoints",
          "type": "uint256"
        }
      ],
      "name": "PointsUpdated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getPoints",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const apiKey = process.env.PIMLICO_BNB_API_KEY;
  if (!apiKey) throw new Error("Missing PIMLICO_API_KEY");

  const privateKey = process.env.PRIVATE_KEY;
  const contractAddress = "0x48CAF9F90d09e4f734c88D6fDE1d0223b0F558Ed";

  const publicClient = createPublicClient({
    chain: bsc,
    transport: http(process.env.BSC_RPC_URL),
  });

  const pimlicoUrl = `https://api.pimlico.io/v2/56/rpc?apikey=${process.env.PIMLICO_BNB_API_KEY}`;

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
    `Smart account address: https://bscscan.com/address/${account.address}`
  );

  const smartAccountClient = createSmartAccountClient({
    account,
    chain: bsc,
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
      functionName: "claimPoints",
      args: [to],
    }),
  });

  console.log(`Transaction sent: https://bscscan.com/tx/${txHash}`);

  // 🔹 **Wait for transaction confirmation**
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  if (!receipt) {
    return res.status(500).json({ message: "Transaction not confirmed" });
  }
  console.log(receipt);



  return res.status(200).json({
    success: true,
    message: "Minted status updated",
    transactionHash: receipt.transactionHash,
  });
};

export const reclaimSBT = async (req, res) => {
  try {
    const { address } = req.query; // Changed from req.params to req.query
    console.log(address);

    if (!address) {
      return res.status(400).json({ message: "Wallet address is required" });
    }

    // Setup contract interaction
    const abi = [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "user",
            "type": "address"
          }
        ],
        "name": "getPoints",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    const contractAddress = "0x48CAF9F90d09e4f734c88D6fDE1d0223b0F558Ed";

    const publicClient = createPublicClient({
      chain: bsc,
      transport: http(process.env.BSC_RPC_URL),
    });

    // Create contract instance with proper configuration
    const contract = {
      address: contractAddress,
      abi,
      publicClient,
    };

    // Call getPoints function using the publicClient directly
    const points = await publicClient.readContract({
      ...contract,
      functionName: 'getPoints',
      args: [address],
    });

    return res.status(200).json({
      success: true,
      message: "Points retrieved successfully", 
      points: points.toString(),
      address: address
    });

  } catch (error) {
    console.error("Error getting points:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get points",
      error: error.message,
    });
  }
};
