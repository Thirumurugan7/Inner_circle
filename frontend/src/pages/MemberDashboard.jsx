import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import mark from "../assets/images/Mark.svg";
import cup from "../assets/images/cup.svg";
import calendar from "../assets/images/Calendar.svg";
import pluscircle from "../assets/images/pluscircle.svg";
import { Link } from "react-router-dom";
import PostData from "../components/PostData";
import HelpedData from "../components/HelpedData";
import axios from "axios";
import bell from '../assets/images/bell.svg'
import { updateUserProfile } from "../components/redux/user/userSlice";
const MemberDashboard = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
  const walletAddress = currentUser?.user?.walletAddress;

  const fetchUserByWallet = async () => {
    try {
      const response = await axios.get(
        `https://inner-circle-nine.vercel.app/api/auth/getUsersByWalletAddress`,
        {
          params: { walletAddress },
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Fetched Data:", response.data); // Log full response
      
      // Check if users array is not empty
      if (response.data?.users?.length > 0) {
        setUserData(response.data.users[0]); // Set the first user object directly
        console.log(response.data.users[0]);
         dispatch(updateUserProfile(response.data.users[0]));
      } else {
        console.warn("No user data found.");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  if (walletAddress) {
    fetchUserByWallet();
  }
}, [currentUser]);

// Add another useEffect to log when userData changes
useEffect(() => {
  console.log("Updated userData:", userData);
}, [userData]);

  return (
    <div>
      <div className="px-[23px] sm:px-[60px] lg:px-[80px] min-h-screen h-full">
        <div className="flex flex-col gap-[10.32px] sm:gap-[8.79px] lg:gap-[15px]">
          <div className="flex gap-[6.88px] sm:gap-[5.86px] lg:gap-[10px] items-center">
            <img
              src={mark}
              alt=""
              className="w-[30.28px] h-[30.28px] sm:w-[25.78px] sm:h-[25.78px] lg:h-[44px] lg:w-[44px]"
            />
            <p className="text-primary thunder-medium font-medium text-[28.9px] leading-[26.59px] sm:text-[24.61px] sm:leading-[22.64px]  lg:text-[42px] lg:leading-[38.64px] tracking-[0px]">
              Hello, {currentUser?.user?.name}.
            </p>
          </div>
          <p className="font-dmSans font-medium text-[15.14px] leading-[19.71px] tracking-[-0.04em] sm:text-[12.89px] sm:leading-[16.78px] sm:tracking-[-0.52px]  lg:text-[22px] lg:leading-[28.64px] lg:tracking-[-0.04em] text-primary">
            Leaderboard & Members List
          </p>
        </div>

        <div className="flex flex-wrap gap-[8.66px] sm:gap-[18.37px] py-[19px] lg:py-[55px]">
          {/* member card */}
          <div className="w-[250.12px] h-[167.96px] rounded-[8.04px] sm:w-[206.82px] sm:h-[121.86px] sm:rounded-[5.86px] lg:w-[288.7px] lg:h-[193.87px] lg:rounded-[9.28px]  shadow-[0px_0px_70.73px_2.41px_#FFFFFF4F]  memberbg sm:shadow-[0px_0px_81.64px_2.78px_#FFFFFF4F] pt-[20.09px]  sm:pl-[13.47px] lg:pt-[23.19px] pl-[18.49px] sm:pt-[14.65px] lg:pl-[21.34px] gap-[8.04px] sm:gap-[5.86px] lg:gap-[9.28px] flex flex-col">
            {currentUser?.user?.isActive ? (
              <div className="flex items-center gap-[2px] ">
                <div className="w-[9.15px] h-[9.15px] sm:w-[6.67px] sm:h-[6.67px] lg:w-[10.56px] lg:h-[10.56px] bg-[#16A34A] shadow-[0px_0px_9.28px_4.64px_#16A34A66] rounded-full"></div>
                <p className="font-medium  text-[14.47px] leading-[18.84px] tracking-[-0.04em] sm:text-[10.55px] sm:leading-[13.73px] sm:tracking-[-0.42px] lg:text-[16.7px] lg:leading-[21.74px] lg:tracking-[-0.668px] text-center font-dmSans">
                  Active
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-[7px] ">
                <div className="w-[9.15px] h-[9.15px] sm:w-[6.67px] sm:h-[6.67px] lg:w-[10.56px] lg:h-[10.56px] bg-[#DC2626] shadow-[0px_0px_9.28px_4.64px_#DC2626] rounded-full"></div>
                <p className="font-medium  text-[14.47px] leading-[18.84px] tracking-[-0.04em] sm:text-[10.55px] sm:leading-[13.73px] sm:tracking-[-0.42px] lg:text-[16.7px] lg:leading-[21.74px] lg:tracking-[-0.668px] text-center font-dmSans">
                  InActive
                </p>
              </div>
            )}

            <div className="gap-[4.02px] sm:gap-[2.93px] lg:gap-[4.64px] flex flex-col">
              <h1 className="font-dmSans font-bold text-[28.93px] leading-[37.67px] tracking-[-0.04em] sm:text-[21.09px] sm:leading-[27.46px] sm:tracking-[-0.84px] lg:text-[33.4px] lg:leading-[43.48px] lg:tracking-[-1.336px] h-[43px]">
                {userData?.name}
              </h1>
              <div className="font-dmSans font-normal text-[12.86px] leading-[16.74px] tracking-[-0.04em] sm:text-[9.37px] sm:leading-[12.21px] sm:tracking-[-0.37px] lg:text-[14.84px] lg:leading-[19.33px] lg:tracking-[-0.5936px] lg:gap-[4.64px] flex flex-col">
                <p className="h-[17px] sm:h-[12px] lg:h-[19px]">
                  Verified Member
                </p>
                <p className="h-[17px] sm:h-[12px] lg:h-[19px]">
                  #IC-{userData?.sbtId}
                </p>
                <p className="h-[17px] sm:h-[12px] lg:h-[19px]">[Base]</p>
              </div>
            </div>
          </div>

          {/* totalpoints card */}
          <div className="w-[250.12px] h-[167.96px] rounded-[8.04px] sm:w-[206.82px] sm:h-[121.86px] sm:rounded-[5.86px] lg:w-[288.7px] lg:h-[193.87px] lg:rounded-[9.28px] flex flex-col totalpointsbg gap-[5.63px] sm:gap-[4.1px] lg:gap-[6.49px] pl-[12.06px] sm:pl-[8.79px] lg:pl-[13.92px] pb-[14px] sm:pb-[13.92px] pt-[40.82px] sm:pt-[25.78px] lg:pt-[40.82px]">
            <p className="font-normal text-[16.07px] leading-[20.93px] tracking-[-0.04em]  sm:text-[11.72px] sm:leading-[15.26px] sm:tracking-[-0.47px] lg:text-[18.55px] lg:leading-[24.16px] lg:tracking-[-0.742px] font-dmSans">
              Total Points Received
            </p>
            <div className="flex flex-col gap-[8.04px] sm:gap-[9.28px]">
              <div className="flex  items-baseline">
                <img
                  src={cup}
                  alt=""
                  className="h-[19.29px] w-[19.29px] sm:h-[14.06px] sm:w-[14.06px] lg:h-fit lg:w-fit"
                />
                <p className="font-bold text-[28.93px] leading-[37.67px] tracking-[-0.04em] sm:text-[21.09px] sm:leading-[27.46px] sm:tracking-[-0.84px] lg:text-[33.4px] lg:leading-[43.48px] lg:tracking-[-1.336px] font-dmSans pl-[9.28px]">
                  {userData?.totalPoints} Points
                </p>
                <p className=" font-normal text-[9.64px] leading-[12.56px] tracking-[-0.04em] sm:text-[7.03px] sm:leading-[9.15px] sm:tracking-[-0.28px] lg:text-[11.13px] lg:leading-[14.49px] lg:tracking-[-0.4452px] font-dmSans pl-[8px]">
                  (Lifetime)
                </p>
              </div>
              <div className="border-[0.93px] border-[#0000001A] h-0"></div>
              <div className="flex  items-baseline">
                <img
                  src={calendar}
                  alt=""
                  className="w-[14.47px] h-[15.67px] sm:w-[10.55px] sm:h-[11.42px] lg:w-[14.47px] lg:h-[15.67px]"
                />
                <p className="font-bold text-[28.93px] leading-[37.67px] tracking-[-0.04em] sm:text-[21.09px] sm:leading-[27.46px] sm:tracking-[-0.84px] lg:text-[33.4px] lg:leading-[43.48px] lg:tracking-[-1.336px] font-dmSans pl-[9.28px] text-[#5C5C5C]">
                  {userData?.pointsReceived} Points
                </p>
                <p className=" font-normal text-[9.64px] leading-[12.56px] tracking-[-0.04em] sm:text-[7.03px] sm:leading-[9.15px] sm:tracking-[-0.28px] lg:text-[11.13px] lg:leading-[14.49px] lg:tracking-[-0.4452px] font-dmSans pl-[8px]">
                  (Monthly)
                </p>
              </div>
            </div>
          </div>

          {/* available points */}
          <div className="w-[250.12px] h-[167.96px] rounded-[8.04px] sm:w-[206.82px] sm:h-[121.86px] sm:rounded-[5.86px] lg:w-[288.7px] lg:h-[193.87px] lg:rounded-[9.28px] flex flex-col totalpointsbg gap-[8.04px] sm:gap-[5.86px] lg:gap-[9.28px] pl-[12.47px] sm:pl-[10.54px] lg:pl-[13.92px] pb-[13.92px] pt-[53.85px]  sm:pt-[39.25px] lg:pt-[62.16px]">
            <p className="font-normal text-[16.07px] leading-[20.93px] tracking-[-0.04em] sm:text-[11.72px] sm:leading-[15.26px] sm:tracking-[-0.47px] lg:text-[18.55px] lg:leading-[24.16px] lg:tracking-[-0.742px] font-dmSans">
              Available Points this month
            </p>
            <div>
              <h1 className="font-bold text-[28.93px] leading-[37.67px] tracking-[-0.04em] sm:text-[21.09px] sm:leading-[27.46px] sm:tracking-[-0.84px] lg:text-[33.4px] lg:leading-[43.48px] lg:tracking-[-1.336px] font-dmSans">
                {userData?.monthlyPoints} Points Left
              </h1>
            </div>
            <div>
              <div className="w-[213.27px] sm:w-[172.84px] lg:w-[246.16px] bg-[#00000026] h-[5.57px] rounded-md overflow-hidden">
                <div
                  className="bg-[#000000] h-[5.57px] rounded-full"
                  style={{ width: `${(userData?.monthlyPoints / 40) * 100}%` }}
                ></div>
              </div>
              <p className="font-semibold text-[9.64px] leading-[12.56px] tracking-[-0.04em] sm:text-[7.03px] sm:leading-[9.15px] sm:tracking-[-0.28px] lg:text-[11.13px] lg:leading-[14.49px] lg:tracking-[-0.4452px] mt-[4.02px] sm:mt-[4.64px]">
                <span className="text-black">
                  {userData?.monthlyPoints}/40 (
                  {((userData?.monthlyPoints / 40) * 100).toFixed(1)}%)
                </span>
                <span className="text-[#00000080]"> Remaining</span>
              </p>
            </div>
          </div>

          {/* ai agent card */}
          <div className="w-[257.42px] h-[165.57px]  sm:hidden lg:block rounded-[8.04px] sm:w-[301px] sm:h-[193.87px] sm:rounded-[9.28px] flex flex-col aiagentbg gap-[9.13px] sm:gap-[10.54px] pl-[12.47px] sm:pl-[13.92px] pt-[59.15px] pb-[13.92px] sm:pt-[68.27px]">
            <h1 className="font-bold thunder-bold text-[29.21px] leading-[26.87px] tracking-[0.02em] sm:text-[33.72px] sm:leading-[31.02px] sm:tracking-[0.6744px] text-primary">
              AI Agent <span className="text-fourty">(Coming Soon)</span>
            </h1>
            <p className="font-normal text-[12.78px] leading-[16.64px] tracking-[-0.04em] sm:text-[14.75px] sm:leading-[19.21px] sm:tracking-[-0.59px] font-dmSans text-eighty w-[231.86px] sm:w-[267.62px]">
              Get things done faster! Your personal AI assistant will help you
              complete tasks, track progress, and maximize your impact in the
              Inner Circle.
            </p>
          </div>
        </div>
        {/* Only show this notification if user has less than 15 points */}
        {userData?.pointsReceived < 15 && (
          <div className="w-fit h-fit bg-[#FFFFFF14] mb-[40px] pt-[5px] flex items-center justify-center rounded-[10px] border-[#FFFFFF33] border-[1px] p-[5px] lg:p-[5px_5px_5px_15px] gap-[5px] lg:gap-[10px]">
            <img
              src={bell}
              alt=""
              className="h-[14px] w-[14px] md:h-[20px] md:w-[20px] lg:h-fit lg:w-fit"
            />
            <p className="font-medium font-dmSans text-[10px] md:text-[14px] lg:text-[16px] text-primary leading-[10px] md:leading-[14px] lg:leading-[24.41px] tracking-[-0.02em]">
              You need{" "}
              <span className="font-bold">
                {15 - (userData?.pointsReceived || 0)} more points
              </span>{" "}
              to stay active!
            </p>
            <Link to="/ask-for-help">
              <button className="w-[98.86px] py-[5px] gap-[4.99px] rounded-[4.99px] border-[0.39px]  px-[6.43px]  text-[10.29px] leading-[15.69px] lg:w-[144px] lg:h-[42.08px] lg:rounded-[9.35px] lg:gap-[7.26px] lg:p-[9.35px] bg-primary cursor-pointer text-black font-dmSans font-medium lg:text-[14px] lg:leading-[22px]">
                Ask for Help Now
              </button>
            </Link>
          </div>
        )}
        <div className="flex flex-wrap gap-[21.66px] mt-[15px] lg:mt-[20px] justify-between">
          <div className="flex flex-col gap-[15px]">
            <div className="flex gap-[6.88px] sm:gap-[5.86px] lg:gap-[10px] items-center">
              <img
                src={mark}
                alt=""
                className="w-[30.28px] h-[30.28px] sm:w-[25.78px] sm:h-[25.78px] lg:h-[44px] lg:w-[44px]"
              />
              <p className="text-primary thunder-medium font-medium text-[28.9px] leading-[26.59px] sm:text-[24.61px] sm:leading-[22.64px]  lg:text-[42px] lg:leading-[38.64px] tracking-[0px]">
                Active Help Requests from Members
              </p>
            </div>
            <p className="font-dmSans font-medium text-[15.14px] leading-[19.71px] tracking-[-0.04em] sm:text-[12.89px] sm:leading-[16.78px] sm:tracking-[-0.52px]  lg:text-[22px] lg:leading-[28.64px] lg:tracking-[-0.04em] text-primary">
              See what fellow members are looking for help with. Jump in,
              contribute, and grow together!
            </p>
          </div>
          <div className="flex gap-[6.43px] lg:gap-[10px]">
            <Link to="/member-requests">
              <button className="w-[98.86px] h-[24.95px] gap-[4.99px] rounded-[4.99px] border-[0.39px]  px-[6.43px]  text-[10.29px] leading-[15.69px] tracking-[0em] text-black font-dm-sans font-medium sm:text-[10.32px] sm:leading-[18.42px] sm:tracking-[0px] lg:text-[16px] lg:leading-[24.41px] lg:tracking-[0] bg-primary lg:w-[149px] lg:h-[38.81px] sm:gap-[7.76px] lg:rounded-[7.76px]  flex items-center justify-center">
                View All Requests
              </button>
            </Link>
            <Link to="/ask-for-help">
              <button className="w-[98.86px] h-[24.95px] gap-[4.99px] rounded-[4.99px] border-[0.39px]  px-[6.43px]  text-[10.29px] leading-[15.69px] tracking-[0em] font-dmSans font-medium lg:text-[16px] sm:text-[10.32px] sm:leading-[18.42px] lg:leading-[24.41px] cursor-pointer text-primary  lg:w-[149px] lg:h-[38.81px] lg:gap-[7.76px] lg:rounded-[7.76px] lg:border-[1px] border-white flex items-center justify-center">
                Ask for Help Now
              </button>
            </Link>
          </div>
        </div>

        {/* post data */}
        <PostData />

        <div className="flex flex-wrap gap-[21.66px] justify-between pt-[55px]">
          <div className="flex flex-col gap-[15px]">
            <div className="flex gap-[6.88px] sm:gap-[5.86px] lg:gap-[10px] items-center">
              <img
                src={mark}
                alt=""
                className="w-[30.28px] h-[30.28px] sm:w-[25.78px] sm:h-[25.78px] lg:h-[44px] lg:w-[44px]"
              />
              <p className="text-primary thunder-medium font-medium text-[28.9px] leading-[26.59px] sm:text-[24.61px] sm:leading-[22.64px]  lg:text-[42px] lg:leading-[38.64px] tracking-[0px]">
                Recent Activity Feed
              </p>
            </div>
            <p className="font-dmSans font-medium text-[15.14px] leading-[19.71px] tracking-[-0.04em] sm:text-[12.89px] sm:leading-[16.78px] sm:tracking-[-0.52px]  lg:text-[22px] lg:leading-[28.64px] lg:tracking-[-0.04em] text-primary">
              See what’s happening in the Circle—real-time contributions and
              impact.
            </p>
          </div>
          <Link
            to="/points-allocation"
            className="flex items-center gap-[3.86px] sm:gap-[4px] lg:gap-[7.76px]"
          >
            <button className="text-black cursor-pointer flex flex-row items-center justify-center bg-primary w-[116.45px] h-[24.88px] gap-[3.86px] rounded-[3.86px] p-[4.98px] font-dmSans font-medium text-[7.96px] leading-[12.15px] sm:text-[10.32px] sm:leading-[18.42px] sm:tracking-[0px] lg:text-[16px] lg:leading-[24.41px] tracking-[0] lg:w-[200.42px] lg:h-[50px] lg:gap-[7px] lg:rounded-[7.76px] lg:p-[7.67px] sm:w-[128.64px] sm:h-[29.29px]  sm:rounded-[5.86px] sm:p-[5.86px]">
              <img
                src={pluscircle}
                alt=""
                className="h-[14.81px] w-[14.81px] sm:w-[14.06px] sm:h-[14.06px] lg:h-fit lg:w-fit"
              />
              <span>Allocate Points Now</span>
            </button>
          </Link>
        </div>

        {/* helped data */}
        <HelpedData />
        <div className="font-semibold cursor-pointer text-[10.41px]  sm:text-[14px] lg:text-[18px] leading-[23.44px] tracking-[-0.72px] text-right font-dmSans text-primary pt-[40px] pb-[5rem]">
          <Link to="/leaderboard"> See the Top Contributors →</Link>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
