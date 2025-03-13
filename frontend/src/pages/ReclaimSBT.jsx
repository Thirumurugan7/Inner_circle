import React, { useState } from "react";
import SBTInfoCard from "../components/SBTInfoCard";
import SBTCard from "../components/SBTCard";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import spin from "../assets/images/spin.svg";
import { updateUserProfile } from "../components/redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const ReclaimSBT = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isReclaiming, setIsReclaiming] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleReclaimSBT = async () => {
    setIsReclaiming(true);
    setError(null);
    setSuccess(null);

    try {
      const walletAddress = currentUser?.user?.walletAddress;
      const token = currentUser?.token;

      if (!walletAddress) {
        console.error("No wallet address found!");
        setError("No wallet address found!");
        return;
      }
      
      const response = await axios.post(
        "http://localhost:5001/api/action/users/reclaim-sbt",
        { userId: walletAddress },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setSuccess(response.data.message);

      if (response.status === 200) {
        console.log("Database updated successfully!");
        dispatch(updateUserProfile(response.data.user));
        navigate("/dashboard", { replace: true });
      } else {
        console.error(
          `Failed to update the database. Status: ${response.status}`
        );
        setError(`Failed to update the database. Status: ${response.status}`);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reclaim SBT");
      console.error("Error reclaiming SBT:", error);
    } finally {
      setIsReclaiming(false);
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
            Your exclusive pass to recognition, rewards, and collaboration in the
            Inner Circle.
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

        {error && (
          <div className="text-red-500 mb-4 text-center">
            {error}
          </div>
        )}
        
        {success && (
          <div className="text-green-500 mb-4 text-center">
            {success}
          </div>
        )}

        {currentUser?.user?.isActive ? (
          <div
            className=" flex items-center justify-center text-white text-center w-[263.07px] h-[37.15px] gap-[5.29px] rounded-[6.61px] border-[0.66px] px-[5.29px] py-[10.58px] text-[13.22px] leading-[15.86px] tracking-[-0.04em] 
              sm:w-[233.18px] sm:h-[32.75px] sm:gap-[4.69px] sm:p-[9.37px] sm:px-[4.69px] sm:rounded-[5.86px] sm:border-[0.59px] 
              sm:text-[11.72px] sm:leading-[14.06px] sm:tracking-[-0.47px] lg:w-[398px] lg:h-[56px] 
               lg:rounded-[10px] lg:border-[1px] p-[16px_8px] font-dmSans font-semibold 
              lg:text-[20px] lg:leading-[24px] lg:tracking-[-0.04em] mb-10"
          >
            Successfully Reclaimed 🎉
          </div>
        ) : (
          <button
            onClick={handleReclaimSBT}
            disabled={isReclaiming}
            className={`w-[263.07px] h-[37.15px] gap-[5.29px] rounded-[6.61px] border-[0.66px] px-[5.29px] py-[10.58px] text-[13.22px] leading-[15.86px] tracking-[-0.04em] 
              sm:w-[233.18px] sm:h-[32.75px] sm:gap-[4.69px] sm:p-[9.37px] sm:px-[4.69px] sm:rounded-[5.86px] sm:border-[0.59px] 
              sm:text-[11.72px] sm:leading-[14.06px] sm:tracking-[-0.47px] lg:w-[398px] lg:h-[56px] 
              cursor-pointer lg:rounded-[10px] lg:border-[1px] p-[16px_8px] font-dmSans font-semibold 
              lg:text-[20px] lg:leading-[24px] lg:tracking-[-0.04em] text-black mb-10 
              ${
                isReclaiming
                  ? "opacity-70 cursor-not-allowed border-[1px] text-primary border-[#E6E8E766] bg-gradient-to-r from-[rgba(255,255,255,0.4)] to-[rgba(255,255,255,0.4)]"
                  : "bg-primary text-black"
              }`}
          >
            {isReclaiming ? (
              <div className="flex items-center gap-[8px] justify-center">
                <img
                  src={spin}
                  alt="Loading"
                  className="h-[13px] w-[13px] sm:w-[14.06px] sm:h-[14.06px] lg:h-fit lg:w-fit animate-spin duration-1500"
                />
                Reclaiming Your SBT
              </div>
            ) : (
              "Reclaim Your SBT Now"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ReclaimSBT;