import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../uicomponents/Logo";
import { useAuth } from "../components/auth/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserProfile,
  setReferralInfo,
  clearReferralInfo,
} from "../components/redux/user/userSlice";

const Signin = () => {
  const { login, isLoggedIn, loading, user, logout, error } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const referralInfo = useSelector((state) => state.user.referralInfo);

  useEffect(() => {
    const handleReferralUpdate = async () => {
      if (referralInfo.isValid && user) {
        try {
          const response = await axios.post(
            "https://inner-circle-nine.vercel.app/api/referral/update-referral",
            {
              walletAddress: currentUser?.user?.walletAddress,
              referralCode: referralInfo.code || "",
              hasReferral: referralInfo.isValid || false,
            }
          );
          console.log("Referral code updated successfully");

          // Dispatch action to update Referral status in Redux
          dispatch(updateUserProfile(response.data.user));

          // Clear the referral info from Redux
          dispatch(clearReferralInfo());

          // Handle navigation based on response
          handleResponseNavigation(response);
        } catch (error) {
          console.error("Failed to update referral code:", error);
        }
      }
    };

    handleReferralUpdate();
  }, [user, navigate, referralInfo, currentUser, dispatch]);

  // Updated function to handle navigation based on API response
  const handleResponseNavigation = (response) => {
    // Get HTTP status code from response
    const statusCode = response.status;

    // Get the user data from the response
    const userData = response.data.user;

    console.log("Navigation logic - Status:", statusCode, "User:", userData);

    if (statusCode === 200) {
      if (userData.Referral && !userData.minted) {
        navigate("/sbt-mint", { replace: true });
      } else if (userData.Referral && userData.minted) {
        navigate("/dashboard", { replace: true });
      }
    } else if (statusCode === 201) {
      if (userData.Referral && !userData.minted) {
        navigate("/sbt-mint", { replace: true });
      } else if (!userData.Referral) {
        navigate("/referral", { replace: true });
      }
    }
  };

  const handleLogin = async () => {
    console.log("Referral info:", referralInfo);
    try {
      await login();

      if (user?.walletAddress) {
        try {
          const response = await axios.post(
            "https://inner-circle-nine.vercel.app/api/referral/update-referral",
            {
              walletAddress: currentUser?.user?.walletAddress,
              referralCode: referralInfo.code || "",
              hasReferral: referralInfo.isValid || false,
            }
          );
          console.log("Login response:", response);

          // Dispatch action to update Referral status in Redux
          dispatch(updateUserProfile(response.data.user));

          // Clear the referral info from Redux
          dispatch(clearReferralInfo());

          // Use the navigation handler with the actual response
          handleResponseNavigation(response);
        } catch (error) {
          console.error("API request failed:", error);
          // Default fallback navigation
          navigate("/referral", { replace: true });
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      navigate('/referral')
    }
  };

  return (
    <div className="px-[90px] pt-[47px] pb-28 xl:mx-12 h-screen">
      <div className="flex items-center w-full sm:w-fit justify-center mb-[47px] sm:items-start sm:justify-items-start">
        <Logo />
      </div>
      <div className="flex flex-col items-center justify-center pt-2 h-full">
        <div className="flex flex-col gap-[8.34px] sm:gap-[12px] mb-[15.9px] sm:mb-8">
          <h1 className="font-dmSans font-bold text-[29.19px] leading-[32.11px] tracking-[-1.17px] sm:text-[24.61px] sm:leading-[27.07px] sm:tracking-[-4%] lg:text-[42px] lg:leading-[46.2px] lg:tracking-[-4%] text-center text-primary">
            Sign in
          </h1>
          <p className="font-dmSans font-normal w-[364px] text-[12.51px] leading-[18.77px] sm:text-[18px] sm:leading-[27px] tracking-[0] text-secondry text-center sm:w-full">
            Please login to continue to your account.
          </p>
        </div>

        {!isLoggedIn ? (
          <button
            onClick={handleLogin}
            className="w-[277.35px] h-[37.24px] gap-[5.56px] rounded-[6.95px] border-[0.7px] 
                  px-[5.56px] py-[11.12px] text-[12.51px] leading-[15.01px] tracking-[-0.125px] font-dmSans font-semibold sm:text-[18px] sm:leading-[21.6px] sm:tracking-[-0.01em] text-black bg-primary sm:w-[399px] sm:h-[54px] sm:p-[16px_8px] sm:gap-[8px] sm:rounded-[10px] cursor-pointer mb-5"
          >
            Sign in with Web3auth
          </button>
        ) : (
          <div className="mt-4">
            <button
              onClick={logout}
              className="w-[277.35px] h-[37.24px] gap-[5.56px] rounded-[6.95px] border-[0.7px] 
                  px-[5.56px] py-[11.12px] text-[12.51px] leading-[15.01px] tracking-[-0.125px] font-dmSans font-semibold sm:text-[18px] sm:leading-[21.6px] sm:tracking-[-0.01em] text-black bg-primary sm:w-[399px] sm:h-[54px] sm:p-[16px_8px] sm:gap-[8px] sm:rounded-[10px] cursor-pointer mb-5"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signin;

// src/pages/Signin.jsx
// import React, { useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import Logo from "../uicomponents/Logo";
// import { useAuth } from "../components/auth/AuthContext";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   updateUserProfile,
//   setReferralInfo,
//   clearReferralInfo,
// } from "../components/redux/user/userSlice";

// const Signin = () => {
//   const { login, isLoggedIn, loading, user, logout, error } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const currentUser = useSelector((state) => state.user.currentUser);
//   const referralInfo = useSelector(
//     (state) => state.user?.referralInfo || { isValid: false, code: "" }
//   );

//   useEffect(() => {
//     // Check for referral code in URL parameters
//     const queryParams = new URLSearchParams(location.search);
//     const refCode = queryParams.get("ref");

//     if (refCode) {
//       dispatch(
//         setReferralInfo({
//           isValid: true,
//           code: refCode,
//         })
//       );
//     }
//   }, [location, dispatch]);

//   useEffect(() => {
//     const handleReferralUpdate = async () => {
//       // Only proceed if user is logged in
//       if (currentUser?.user?.walletAddress) {
//         try {
//           // Include referral information if available, otherwise update with referral=false
//           const response = await axios.post(
//             "http://localhost:5000/api/referral/update-referral",
//             {
//               walletAddress: currentUser.user.walletAddress,
//               referralCode: referralInfo?.code || "", // Pass empty string if no code
//               hasReferral: referralInfo?.isValid || false, // Pass false if no valid referral
//             }
//           );

//           console.log("User profile updated successfully");

//           // Dispatch action to update user profile in Redux
//           dispatch(updateUserProfile(response.data.user));

//           // Clear the referral info from Redux
//           dispatch(clearReferralInfo());

//           // Navigate to /sbt-mint if referral was valid, otherwise go to home
//           if (referralInfo?.isValid) {
//             navigate("/sbt-mint", { replace: true });
//           } else {
//             navigate("/", { replace: true });
//           }
//         } catch (error) {
//           console.error("Failed to update user profile:", error);
//           // Navigate to home on error
//           navigate("/", { replace: true });
//         }
//       }
//     };

//     if (isLoggedIn && currentUser?.user) {
//       handleReferralUpdate();
//     }
//   }, [currentUser, navigate, dispatch, referralInfo, isLoggedIn]);

//   const handleLogin = async () => {
//     try {
//       await login();
//       // After successful login, the useEffect with handleReferralUpdate will run
//       // No need to navigate here as it's handled in the useEffect
//     } catch (error) {
//       console.error("Login failed:", error);
//     }
//   };

//   return (
//     <div className="px-[90px] pt-[47px] pb-28 xl:mx-12 h-screen">
//       <div className="flex items-center w-full sm:w-fit justify-center mb-[47px] sm:items-start sm:justify-items-start">
//         <Logo />
//       </div>
//       <div className="flex flex-col items-center justify-center pt-2 h-full">
//         <div className="flex flex-col gap-[8.34px] sm:gap-[12px] mb-[15.9px] sm:mb-8">
//           <h1 className="font-dmSans font-bold text-[29.19px] leading-[32.11px] tracking-[-1.17px] sm:text-[24.61px] sm:leading-[27.07px] sm:tracking-[-4%] lg:text-[42px] lg:leading-[46.2px] lg:tracking-[-4%] text-center text-primary">
//             Sign in
//           </h1>
//           <p className="font-dmSans font-normal w-[364px] text-[12.51px] leading-[18.77px] sm:text-[18px] sm:leading-[27px] tracking-[0] text-secondry text-center sm:w-full">
//             Please login to continue to your account.
//           </p>
//           {referralInfo?.isValid && (
//             <p className="font-dmSans font-normal text-[12.51px] sm:text-[16px] text-green-600 text-center">
//               Referral code is ready to be applied
//             </p>
//           )}
//         </div>

//         {loading ? (
//           <p>Loading...</p>
//         ) : !isLoggedIn ? (
//           <button
//             onClick={handleLogin}
//             className="w-[277.35px] h-[37.24px] gap-[5.56px] rounded-[6.95px] border-[0.7px]
//                   px-[5.56px] py-[11.12px] text-[12.51px] leading-[15.01px] tracking-[-0.125px] font-dmSans font-semibold sm:text-[18px] sm:leading-[21.6px] sm:tracking-[-0.01em] text-black bg-primary sm:w-[399px] sm:h-[54px] sm:p-[16px_8px] sm:gap-[8px] sm:rounded-[10px] cursor-pointer mb-5"
//           >
//             Sign in with Web3auth
//           </button>
//         ) : (
//           <div className="mt-4">
//             <button
//               onClick={logout}
//               className="w-[277.35px] h-[37.24px] gap-[5.56px] rounded-[6.95px] border-[0.7px]
//                   px-[5.56px] py-[11.12px] text-[12.51px] leading-[15.01px] tracking-[-0.125px] font-dmSans font-semibold sm:text-[18px] sm:leading-[21.6px] sm:tracking-[-0.01em] text-black bg-primary sm:w-[399px] sm:h-[54px] sm:p-[16px_8px] sm:gap-[8px] sm:rounded-[10px] cursor-pointer mb-5"
//             >
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Signin;
