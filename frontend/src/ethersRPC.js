import { ethers } from "ethers";

const getChainId = async (provider) => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const networkDetails = await ethersProvider.getNetwork();
    return networkDetails.chainId.toString();
  } catch (error) {
    return error;
  }
};

const getAccounts = async (provider) => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();
    return await signer.getAddress();
  } catch (error) {
    return error;
  }
};

const getBalance = async (provider) => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();
    const address = await signer.getAddress();
    return ethers.formatEther(await ethersProvider.getBalance(address));
  } catch (error) {
    return error;
  }
};

const sendTransaction = async (provider) => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();
    const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56";
    const amount = ethers.parseEther("0.001");
    const fees = await ethersProvider.getFeeData();

    const tx = await signer.sendTransaction({
      to: destination,
      value: amount,
      maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
      maxFeePerGas: fees.maxFeePerGas,
    });

    return await tx.wait();
  } catch (error) {
    return error;
  }
};

const signMessage = async (provider) => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();
    return await signer.signMessage("YOUR_MESSAGE");
  } catch (error) {
    return error;
  }
};

export default {
  getChainId,
  getAccounts,
  getBalance,
  sendTransaction,
  signMessage,
};
