import {
  createPublicClient,
  createWalletClient,
  http,
  parseAbi,
  encodeFunctionData,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

// Constants
const contractAddress = "0x6604938BE60a32EA9B4F0f12c25a89B14E9d1827";

// ABI definitions
const revokeAbi = parseAbi(["function revokeToken(uint256 tokenId)"]);

const reinstateAbi = parseAbi(["function reinstateToken(uint256 tokenId)"]);

// Create clients
const createClients = () => {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) throw new Error("Missing PRIVATE_KEY");

  const infuraUrl = process.env.INFURA_URL;
  if (!infuraUrl) throw new Error("Missing INFURA_URL");

  // Create public client for reading blockchain data
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(infuraUrl),
  });

  // Create wallet client for sending transactions
  const account = privateKeyToAccount(privateKey);
  const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(infuraUrl),
  });

  return { publicClient, walletClient };
};

// Revoke an SBT
export const revokeUserSBT = async (tokenId) => {
  try {
    const { publicClient, walletClient } = createClients();

    // Prepare transaction data
    const data = encodeFunctionData({
      abi: revokeAbi,
      functionName: "revokeToken",
      args: [tokenId],
    });

    // Send transaction
    const hash = await walletClient.sendTransaction({
      to: contractAddress,
      data,
      account: walletClient.account,
    });

    console.log(
      `Revocation transaction sent: https://sepolia.basescan.io/tx/${hash}`
    );

    // Wait for transaction confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
    });

    return receipt;
  } catch (error) {
    console.error(`Error revoking SBT with tokenId ${tokenId}:`, error);
    throw error;
  }
};

// Reinstate an SBT
export const reinstateUserSBT = async (tokenId) => {
  try {
    const { publicClient, walletClient } = createClients();

    // Prepare transaction data
    const data = encodeFunctionData({
      abi: reinstateAbi,
      functionName: "reinstateToken",
      args: [tokenId],
    });

    // Send transaction
    const hash = await walletClient.sendTransaction({
      to: contractAddress,
      data,
      account: walletClient.account,
    });

    console.log(
      `Reinstatement transaction sent: https://sepolia.basescan.io/tx/${hash}`
    );

    // Wait for transaction confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
    });

    return receipt;
  } catch (error) {
    console.error(`Error reinstating SBT with tokenId ${tokenId}:`, error);
    throw error;
  }
};
