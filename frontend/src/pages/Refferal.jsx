import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Logo from "../uicomponents/Logo";
import {updateUserProfile, setReferralInfo} from '../components/redux/user/userSlice'

const Refferal = () => {
  const [referralCode, setReferralCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleReferralSubmit = async () => {
    try {
      console.log(referralCode.trim());
      const response = await axios.post(
        "http://localhost:5000/api/referral/validate-referral",
        { referralCode: referralCode.trim() }
      );

      if (response.data.success) {
        if (currentUser?.user) {
          // If user exists, update referral in the backend
          await updateReferralCode();
        } else {
          // Store referral info locally if no user is logged in
          dispatch(
            setReferralInfo({
              isValid: true,
              code: referralCode.trim(),
            })
          );

          navigate("/signin", { replace: true });
        }
      } else {
        setErrorMessage("Invalid referral code. Please try again.");
      }
    } catch (error) {
      console.error("Failed to validate referral code:", error);
      setErrorMessage("Server error. Please try again later.");
    }
  };
const updateReferralCode = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5001/api/referral/update-referral",
      {
        walletAddress: currentUser?.user?.walletAddress,
        referralCode: referralCode.trim(),
        hasReferral: true,
      }
    );

    if (response.data.success) {
      console.log("Referral status update:", response.data.message);

      if (response.data?.user) {
        dispatch(updateUserProfile(response.data.user));
      } else {
        console.error("User data not found in response:", response.data);
      }

      navigate("/sbt-mint", { replace: true });
    } else {
      setErrorMessage(
        response.data.message || "Failed to update referral code."
      );
    }
  } catch (error) {
    console.error("Failed to update referral code:", error);
    setErrorMessage(
      "Server error while updating referral. Please try again later."
    );
  }
};

  // Handle input changes and clear error messages if present
  const handleInputChange = (e) => {
    setReferralCode(e.target.value);
    if (errorMessage) setErrorMessage("");
  };

  useEffect(() => {
    const isReferralValid = localStorage.getItem("isReferralValid");
    const storedReferralCode = localStorage.getItem("referralCode");

    if (isReferralValid === "true" && currentUser) {
      updateReferralCode();
    }
  }, [currentUser]);

  return (
    <div className="cursor-default flex flex-col gap-[29.03px] lg:gap-[40px] items-center justify-center h-screen px-10 refferalbg sm:bg-contain lg:bg-cover xl:mx-12">
      <Logo />
      <div className="flex flex-col gap-[18.45px] lg:gap-[30px]">
        <div className="flex flex-col gap-[7.38px] lg:gap-[12px] px-[15px]">
          <div className="sm:hidden font-dmSans flex flex-col lg:flex-row font-bold text-[22px] leading-[24.2px] tracking-[-1.32px] lg:text-[38px] lg:leading-[41.8px] lg:-tracking-[.8px] text-center text-primary">
            <h1>Got a Referral Code?</h1>
            <h1>Join with a Connection!</h1>
          </div>
          <div className="font-dmSans hidden sm:block font-bold text-[22px] leading-[24.2px] tracking-[-1.32px] lg:text-[38px] lg:leading-[41.8px] lg:-tracking-[.8px] text-center text-primary">
            Got a Referral Code? Join with a Connection!
          </div>

          <p className="font-dmSans w-[326.62px] mx-auto lg:w-full font-normal text-[12px] leading-[18px] lg:text-[18px] lg:leading-[27px] text-center text-secondry">
            Enter your referral code to unlock exclusive access and become part
            of the Inner Circle.
          </p>
        </div>

        {currentUser?.user?.Refferal ? (
          <div className="flex items-center flex-col w-full gap-[10px]">
            {" "}
            <div className=" font-dmSans text-[22px] text-center text-primary lg:text-[38px]">
              Referral code Verified!
            </div>
            <Link to="/">
              <button className="text-white font-dm-sans font-medium text-[11.41px] border-[1px] border-primary leading-[17.41px] lg:text-[16px] lg:leading-[24.41px] bg-black  h-[35.66px]   lg:h-[50px] rounded-[7.76px] p-[7.13px] lg:p-[10px] lg:py-[8px] cursor-pointer w-fit">
                Back Home
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-[18.45px] lg:gap-[30px]">
            <input
              type="text"
              value={referralCode}
              onChange={handleInputChange}
              placeholder="Enter your code here"
              className={`w-[326.62px] h-[33.83px] lg:w-[531px] lg:h-[55px] rounded-[7.72px] lg:rounded-[12.55px] border-[0.54px] lg:border-[0.88px] px-[12.35px] py-[9.26px] lg:px-[20.07px] lg:py-[15.05px] 
      border-twenty placeholder:text-fourty text-fourty placeholder:text-[11.07px] lg:placeholder:text-[18px] outline-none text-[12px] lg:text-[18px] ${
        errorMessage ? "border-[#DC2626]" : ""
      }`}
            />
            {errorMessage && (
              <p className="text-[#DC2626] font-dmSans text-[12px]">
                {errorMessage}
              </p>
            )}
            <button
              onClick={handleReferralSubmit}
              className="text-black font-dm-sans font-medium text-[11.41px] leading-[17.41px] lg:text-[16px] lg:leading-[24.41px] bg-primary w-[166.88px] h-[35.66px] lg:w-[234px] lg:h-[50px] rounded-[7.76px] p-[7.13px] lg:p-[10px] cursor-pointer"
            >
              Continue with Referral
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Refferal;


// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import Logo from "../uicomponents/Logo";
// import {
//   updateUserProfile,
//   setReferralInfo,
// } from "../components/redux/user/userSlice";

// const Referral = () => {
//   const [referralCode, setReferralCode] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const currentUser = useSelector((state) => state.user.currentUser);

//   const handleReferralSubmit = async () => {
//     try {
//       console.log(referralCode.trim());
//       const response = await axios.post(
//         "http://localhost:5000/api/referral/validate-referral",
//         { referralCode: referralCode.trim() }
//       );

//       if (response.data.success) {
//         if (currentUser?.user) {
//           // If user exists, update referral in the backend directly
//           await updateReferralCode();
//         } else {
//           // Store referral info in Redux and navigate to signin with params
//           dispatch(
//             setReferralInfo({
//               isValid: true,
//               code: referralCode.trim(),
//             })
//           );

//           // Navigate to signin with referral code as a URL parameter
//           navigate(`/signin?ref=${encodeURIComponent(referralCode.trim())}`, {
//             replace: true,
//           });
//         }
//       } else {
//         setErrorMessage("Invalid referral code. Please try again.");
//       }
//     } catch (error) {
//       console.error("Failed to validate referral code:", error);
//       setErrorMessage("Server error. Please try again later.");
//     }
//   };

//   const updateReferralCode = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/referral/update-referral",
//         { walletAddress: currentUser?.user?.walletAddress }
//       );

//       if (response.data?.user) {
//         console.log("Referral code updated successfully");
//         dispatch(updateUserProfile(response.data.user));
//       } else {
//         console.error("User data not found in response:", response.data);
//       }

//       // Clear referral info from Redux
//       dispatch(
//         setReferralInfo({
//           isValid: false,
//           code: "",
//         })
//       );

//       navigate("/sbt-mint", { replace: true });
//     } catch (error) {
//       console.error("Failed to update referral code:", error);
//     }
//   };

//   // Handle input changes and clear error messages if present
//   const handleInputChange = (e) => {
//     setReferralCode(e.target.value);
//     if (errorMessage) setErrorMessage("");
//   };

//   return (
//     <div className="cursor-default flex flex-col gap-[29.03px] lg:gap-[40px] items-center justify-center h-screen px-10 refferalbg sm:bg-contain lg:bg-cover xl:mx-12">
//       <Logo />
//       <div className="flex flex-col gap-[18.45px] lg:gap-[30px]">
//         <div className="flex flex-col gap-[7.38px] lg:gap-[12px] px-[15px]">
//           <div className="sm:hidden font-dmSans flex flex-col lg:flex-row font-bold text-[22px] leading-[24.2px] tracking-[-1.32px] lg:text-[38px] lg:leading-[41.8px] lg:-tracking-[.8px] text-center text-primary">
//             <h1>Got a Referral Code?</h1>
//             <h1>Join with a Connection!</h1>
//           </div>
//           <div className="font-dmSans hidden sm:block font-bold text-[22px] leading-[24.2px] tracking-[-1.32px] lg:text-[38px] lg:leading-[41.8px] lg:-tracking-[.8px] text-center text-primary">
//             Got a Referral Code? Join with a Connection!
//           </div>

//           <p className="font-dmSans w-[326.62px] mx-auto lg:w-full font-normal text-[12px] leading-[18px] lg:text-[18px] lg:leading-[27px] text-center text-secondry">
//             Enter your referral code to unlock exclusive access and become part
//             of the Inner Circle.
//           </p>
//         </div>

//         {currentUser?.user?.Refferal ? (
//           <div className="flex items-center flex-col w-full gap-[10px]">
//             {" "}
//             <div className=" font-dmSans text-[22px] text-center text-primary lg:text-[38px]">
//               Referral code Verified!
//             </div>
//             <Link to="/">
//               <button className="text-white font-dm-sans font-medium text-[11.41px] border-[1px] border-primary leading-[17.41px] lg:text-[16px] lg:leading-[24.41px] bg-black  h-[35.66px]   lg:h-[50px] rounded-[7.76px] p-[7.13px] lg:p-[10px] lg:py-[8px] cursor-pointer w-fit">
//                 Back Home
//               </button>
//             </Link>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center gap-[18.45px] lg:gap-[30px]">
//             <input
//               type="text"
//               value={referralCode}
//               onChange={handleInputChange}
//               placeholder="Enter your code here"
//               className={`w-[326.62px] h-[33.83px] lg:w-[531px] lg:h-[55px] rounded-[7.72px] lg:rounded-[12.55px] border-[0.54px] lg:border-[0.88px] px-[12.35px] py-[9.26px] lg:px-[20.07px] lg:py-[15.05px] 
//       border-twenty placeholder:text-fourty text-fourty placeholder:text-[11.07px] lg:placeholder:text-[18px] outline-none text-[12px] lg:text-[18px] ${
//         errorMessage ? "border-[#DC2626]" : ""
//       }`}
//             />
//             {errorMessage && (
//               <p className="text-[#DC2626] font-dmSans text-[12px]">
//                 {errorMessage}
//               </p>
//             )}
//             <button
//               onClick={handleReferralSubmit}
//               className="text-black font-dm-sans font-medium text-[11.41px] leading-[17.41px] lg:text-[16px] lg:leading-[24.41px] bg-primary w-[166.88px] h-[35.66px] lg:w-[234px] lg:h-[50px] rounded-[7.76px] p-[7.13px] lg:p-[10px] cursor-pointer"
//             >
//               Continue with Referral
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Referral;
