import React, { useState } from "react";
import SBTInfoCard from "../components/SBTInfoCard";
import SBTCard from "../components/SBTCard";
import { ethers } from "ethers";
import { parseAbi } from "viem";
import SoulboundABI from "../ABI/Soulbound.json";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import spin from "../assets/images/spin.svg";
import { updateUserProfile } from "../components/redux/user/userSlice";
import { useNavigate } from "react-router-dom";
// import { accountAbstractionProvider } from "../components/auth/AuthContext";
const contractAddress = "0x42a8872d40349b6bE320E3cfDE9400C438891911";

const MintSBT = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMinting, setIsMinting] = useState(false); // New state for loading
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const mintSBT = async () => {
  //   try {
  //     if (!currentUser?.user?.Refferal) {
  //       navigate("/referral");
  //       return;
  //     }

  //     setIsMinting(true); // Start loading state

  //     const walletAddress = currentUser?.user?.walletAddress;
  //     const token = currentUser?.token;
  //     const tokenURI =
  //       "ipfs://bafkreigp6tzpmxxdjxe66c4n2yvwn3c24kgp6wcks5recrjlldvj3lzfye";

  //     if (!walletAddress) {
  //       console.error("No wallet address found!");
  //       return;
  //     }

  //     // Check if account abstraction provider is ready
  //     // if (
  //     //   !accountAbstractionProvider.bundlerClient ||
  //     //   !accountAbstractionProvider.smartAccount
  //     // ) {
  //     //   console.error("Account abstraction not properly initialized");
  //     //   return;
  //     // }

  //     // Get bundler client and smart account from the provider
  //     const bundlerClient = accountAbstractionProvider.bundlerClient;
  //     const smartAccount = accountAbstractionProvider.smartAccount;

  //     // Pimlico's ERC-20 Paymaster address
  //     const pimlicoPaymasterAddress =
  //       "0xFC3e86566895Fb007c6A0d3809eb2827DF94F751";
  //     // USDC address on Ethereum Sepolia
  //     const usdcAddress = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  //     // 10 USDC in WEI format. Since USDC has 6 decimals, 10 * 10^6
  //     const approvalAmount = 10000000n;

  //     // Create calldata for safeMint function
  //     const contract = new ethers.Contract(
  //       contractAddress,
  //       SoulboundABI.abi,
  //       new ethers.VoidSigner(walletAddress)
  //     );
  //     const mintCalldata = contract.interface.encodeFunctionData("safeMint", [
  //       walletAddress,
  //       tokenURI,
  //     ]);

  //     const userOpHash = await bundlerClient.sendUserOperation({
  //       account: smartAccount,
  //       calls: [
  //         // Approve USDC on Sepolia chain for Pimlico's ERC 20 Paymaster
  //         {
  //           to: usdcAddress,
  //           abi: parseAbi(["function approve(address,uint)"]),
  //           functionName: "approve",
  //           args: [pimlicoPaymasterAddress, approvalAmount],
  //         },
  //         // Call to the safeMint function on the SBT contract
  //         //  {
  //         //    to: contractAddress,
  //         //    data: mintCalldata,
  //         //  },
  //       ],
  //     });

  //     console.log("op", userOpHash);

  //     // Retrieve user operation receipt
  //     const receipt = await bundlerClient.waitForUserOperationReceipt({
  //       hash: userOpHash,
  //     });

  //     const transactionHash = receipt.receipt.transactionHash;
  //     console.log("Transaction hash:", transactionHash);

  //     // Get transaction receipt to extract event data
  //     const provider = new ethers.JsonRpcProvider(
  //       "https://base-sepolia.infura.io/v3/763d9b7735b04bf58b91993dcc143866"
  //     );
  //     const txReceipt = await provider.getTransactionReceipt(transactionHash);

  //     // Extract the sbtminted event
  //     const sbtMintedEvent = txReceipt.logs
  //       .filter(
  //         (log) => log.address.toLowerCase() === contractAddress.toLowerCase()
  //       )
  //       .map((log) => {
  //         try {
  //           return contract.interface.parseLog({
  //             topics: log.topics,
  //             data: log.data,
  //           });
  //         } catch (e) {
  //           return null;
  //         }
  //       })
  //       .find((event) => event && event.name === "sbtminted");

  //     console.log("SBT Minted successfully!", txReceipt);

  //     if (sbtMintedEvent) {
  //       const tokenId = sbtMintedEvent.args[1].toString();
  //       const tokenIdNumber = Number(tokenId);

  //       const response = await axios.post(
  //         "http://localhost:5000/api/auth/minted",
  //         { walletAddress, sbtId: tokenIdNumber },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       if (response.status === 200) {
  //         console.log("Database updated successfully!");
  //         dispatch(updateUserProfile(response.data.user));
  //         navigate("/sbt-minted-Successfully", { replace: true });
  //       } else {
  //         console.error(
  //           `Failed to update the database. Status: ${response.status}`
  //         );
  //       }
  //     } else {
  //       console.error("Token ID not found in transaction logs!");
  //     }
  //   } catch (error) {
  //     console.error("Minting failed:", error.message);
  //     if (error.response) {
  //       console.error("Backend error:", error.response.data);
  //     }
  //   } finally {
  //     setIsMinting(false); // Stop loading state
  //   }
  // };

  const mintSBT = async () => {
    try {
      if (!currentUser?.user?.Refferal) {
        navigate("/referral");
        return;
      }

      setIsMinting(true); // Start loading state

      const walletAddress = currentUser?.user?.walletAddress;
      const token = currentUser?.token;
      

      if (!walletAddress) {
        console.error("No wallet address found!");
        return;
      }

     

      if (walletAddress) {
        const response = await axios.post(
          "http://localhost:5001/api/action/minting",
          { to:walletAddress }, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          console.log("Database updated successfully!");
          dispatch(updateUserProfile(response.data.user));
          navigate("/predefined-help-request", { replace: true });
        } else {
          console.error(
            `Failed to update the database. Status: ${response.status}`
          );
        }
      } else {
        console.error("Token ID not found!");
      }
    } catch (error) {
      console.error("Minting failed:", error.message);
      if (error.response) {
        console.error("Backend error:", error.response.data);
      }
    } finally {
      setIsMinting(false); // Stop loading state
    }
  };


  

  return (
    <div className="sm:px-[20px] h-auto min-h-screen overflow-y-auto bg-cover SBTbg">
      <div className="flex flex-col items-center justify-center h-full sm:p-[68px] gap-[50px] py-10">
        <div className="flex flex-col items-center justify-center w-full sm:max-w-[281.23px] lg:max-w-[480px] gap-[6.61px] sm:gap-[5.86px] lg:gap-[6px]">
          <h1 className="thunder-bold font-bold text-[44.95px] leading-[41.35px] tracking-[-0.01em] sm:text-[39.84px] sm:leading-[36.65px] sm:tracking-[-0.4px] lg:text-[68px] lg:leading-[62.56px] lg:tracking-[-0.68px] text-center text-primary">
            Welcome to Inner Circle!
          </h1>
          <p className="font-dmSans font-normal text-[14.53px] leading-[18.92px] tracking-[-0.04em] lg:text-[22px] w-[317px] sm:text-[12.89px] sm:leading-[16.78px] sm:tracking-[-0.52px] lg:w-full lg:leading-[28.64px] lg:tracking-[-0.88px] text-center text-sixty pt-[10px]">
            Your exclusive pass to recognition, rewards, and collaboration in
            the Inner Circle.
          </p>
        </div>

        <div
          className="relative w-[263.07px] h-[360.23px] sm:w-[233.18px] sm:h-[319.31px] lg:w-[398px] lg:h-[545px] cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`absolute w-full h-full transition-transform duration-500 transform ${
              isHovered ? "rotate-y-180" : ""
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute w-full h-full backface-hidden">
              <SBTCard />
            </div>
            <div
              className="absolute w-full h-full backface-hidden rotate-y-180"
              style={{ backfaceVisibility: "hidden" }}
            >
              <SBTInfoCard />
            </div>
          </div>
        </div>

        {currentUser?.user?.minted ? (
          <div
            className=" bg-[#50BA77] flex items-center justify-center  text-white text-center w-[263.07px] h-[37.15px] gap-[5.29px] rounded-[6.61px] border-[0.66px] px-[5.29px] py-[10.58px] text-[13.22px] leading-[15.86px] tracking-[-0.04em] 
    sm:w-[233.18px] sm:h-[32.75px] sm:gap-[4.69px] sm:p-[9.37px] sm:px-[4.69px] sm:rounded-[5.86px] sm:border-[0.59px] 
    sm:text-[11.72px] sm:leading-[14.06px] sm:tracking-[-0.47px] lg:w-[398px] lg:h-[56px] 
    cursor-pointer lg:rounded-[10px] lg:border-[1px] p-[16px_8px] font-dmSans font-semibold 
    lg:text-[20px] lg:leading-[24px] lg:tracking-[-0.04em]  mb-10  "
          >
            Successfully Minted 🎉
          </div>
        ) : (
          <button
            onClick={mintSBT}
            disabled={isMinting}
            className={`w-[263.07px] h-[37.15px] gap-[5.29px] rounded-[6.61px] border-[0.66px] px-[5.29px] py-[10.58px] text-[13.22px] leading-[15.86px] tracking-[-0.04em] 
    sm:w-[233.18px] sm:h-[32.75px] sm:gap-[4.69px] sm:p-[9.37px] sm:px-[4.69px] sm:rounded-[5.86px] sm:border-[0.59px] 
    sm:text-[11.72px] sm:leading-[14.06px] sm:tracking-[-0.47px] lg:w-[398px] lg:h-[56px] 
    cursor-pointer lg:rounded-[10px] lg:border-[1px] p-[16px_8px] font-dmSans font-semibold 
    lg:text-[20px] lg:leading-[24px] lg:tracking-[-0.04em] text-black mb-10 
    ${
      isMinting
        ? "opacity-70 cursor-not-allowed border-[1px] text-primary border-[#E6E8E766] bg-gradient-to-r from-[rgba(255,255,255,0.4)] to-[rgba(255,255,255,0.4)]"
        : "bg-primary text-black"
    }`}
          >
            {isMinting ? (
              <div className="flex items-center gap-[8px] justify-center">
                <img
                  src={spin}
                  alt="Loading"
                  className="h-[13px] w-[13px] sm:w-[14.06px] sm:h-[14.06px] lg:h-fit lg:w-fit animate-spin duration-1500"
                />
                Minting Your SBT
              </div>
            ) : (
              "Mint Your SBT Now"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default MintSBT;
