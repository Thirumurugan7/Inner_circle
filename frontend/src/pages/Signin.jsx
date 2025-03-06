// src/pages/Signin.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../uicomponents/Logo";
import { useAuth } from "../components/auth/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../components/redux/user/userSlice";
const Signin = () => {
  const { login, isLoggedIn, loading, user, logout, error } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
useEffect(() => {
  const handleReferralUpdate = async () => {
    const isReferralValid = localStorage.getItem("isReferralValid");
    const referralCode = localStorage.getItem("referralCode");

    if (isReferralValid === "true" && user) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/referral/update-referral",
          {
            walletAddress: currentUser?.user?.walletAddress,
          }
        );
        console.log("Referral code updated successfully");

        // Dispatch action to update Referral status in Redux
       dispatch(updateUserProfile(response.data.user));


        // Clear the localStorage and navigate to /sbt-mint
        localStorage.removeItem("isReferralValid");
        localStorage.removeItem("referralCode");

        // Navigate to /sbt-mint if referral is valid
        navigate("/sbt-mint", { replace: true });
      } catch (error) {
        console.error("Failed to update referral code:", error);
      }
    }
  };

  handleReferralUpdate();
}, [user, navigate]); // Added navigate to dependencies

const handleLogin = async () => {
  try {
    await login();

    // Check if the referral code was valid
    const isReferralValid = localStorage.getItem("isReferralValid");

    if (isReferralValid === "true" && user?.walletAddress) {
      const response = await axios.post(
        "http://localhost:5000/api/referral/update-referral",
        {
          walletAddress: currentUser?.user?.walletAddress,
        }
      );
      console.log(response.data.user)
      // Dispatch action to update Referral status in Redux
      dispatch(updateUserProfile(response.data.user));


      // Clear the referral code and navigate to /sbt-mint
      localStorage.removeItem("isReferralValid");
      // navigate("/sbt-mint", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  } catch (error) {
    console.error("Login failed:", error);
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

        {loading ? (
          <p>Loading...</p>
        ) : !isLoggedIn ? (
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
