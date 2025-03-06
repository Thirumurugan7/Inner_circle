import React from "react";
import loginstar from "../../assets/images/loginstar.svg";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import profile from "../../assets/images/profile.svg";

const DesktopMenu = () => {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Member Requests", path: "/member-requests" },
    { name: "Points Allocation", path: "/points-allocation" },
    { name: "Leaderboard", path: "/leaderboard" },
  ];

  const menu = [
    { name: "Community", path: "#community" },
    { name: "The Path", path: "#path" },
    { name: "Values", path: "#value" },
  ];

  const currentUser = useSelector((state) => state.user.currentUser);
  const referral = currentUser?.user?.referral;
  const minted = currentUser?.user?.minted;

  return (
    <div className="hidden sm:block">
      {!currentUser?.user ? (
        // No current user → Show MEMBER LOGIN button
        <div className="flex gap-[65px]">
          <div className="flex flex-col gap-[2.93px] lg:gap-[5px] uppercase">
            {menu.map((item, index) => (
              <a href={item.path} className="cursor-pointer">
                <div
                  key={index}
                  className={`flex lg:gap-[12px] items-center cursor-pointer group transition-all duration-300 `}
                >
                  <>
                    {/* Small square indicator */}
                    <div
                      className={`w-[7.03px] h-[7.03px] lg:w-[12px] lg:h-[12px] border-[1px] transition-all duration-300 text-sixty
                                
                                 border-sixty group-hover:border-primary group-hover:bg-primary
                            `}
                    ></div>

                    {/* Text */}
                    <p className="font-dmSans text-[10.55px] leading-[13.73px] lg:text-[18px] text-sixty group-hover:text-primary lg:leading-[23.44px] tracking-[0em] transition-all duration-300">
                      {item.name}
                    </p>
                  </>
                </div>
              </a>
            ))}
          </div>
          <div className="hidden sm:flex flex-col items-center ">
            <div className="flex gap-[2.96px] lg:gap-[5px] items-center">
              <img
                src={loginstar}
                alt=""
                className="h-[25.48px] w-[25.48px] lg:h-[43px] lg:w-[43px]"
              />
              <button className="text-black bg-white w-[112.56px] h-[25.85px] gap-[5.93px] rounded-[32px] px-[17.78px] py-[5.93px] lg:w-[190px] lg:h-[43px] lg:rounded-[54px] lg:px-[17.58px] lg:py-[10px] text-center font-dmSans font-normal text-[10.67px] leading-[13.89px] lg:text-[18px] lg:leading-[23.44px] tracking-[0%]">
                <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                  MEMBER LOGIN
                </Link>
              </button>
            </div>
            <p className="text-sixty font-dmSans font-normal  text-[8.3px] leading-[10.8px] lg:text-[14px] lg:leading-[18.23px] tracking-[-0.04em] text-center mt-[8px]">
              Already a member?
            </p>
          </div>
        </div>
      ) : !currentUser?.user?.Refferal ? (
        // Referral is false → Show Enter Referral Code button
        <button className="text-black bg-white w-fit h-[25.85px] gap-[5.93px] rounded-[32px] px-[17.78px] py-[5.93px]  lg:h-[43px] lg:rounded-[54px] lg:px-[17.58px] lg:py-[10px] text-center font-dmSans font-normal text-[10.67px] leading-[13.89px] lg:text-[18px] lg:leading-[23.44px] tracking-[0%]">
          <Link to="/referral">Enter Referral Code</Link>
        </button>
      ) : currentUser?.user?.Refferal && !currentUser?.user?.minted ? (
        // Minted is false → Show Mint SBT button
        <button className="text-black bg-white w-[112.56px] h-[25.85px] gap-[5.93px] rounded-[32px] px-[17.78px] py-[5.93px] lg:w-[190px] lg:h-[43px] lg:rounded-[54px] lg:px-[17.58px] lg:py-[10px] text-center font-dmSans font-normal text-[10.67px] leading-[13.89px] lg:text-[18px] lg:leading-[23.44px] tracking-[0%]">
          <Link to="/sbt-mint">Mint SBT</Link>
        </button>
      ) : (
        // Both Referral and Minted are true → Show Menu
        <div className="flex gap-[50px]">
          <div className="flex flex-col gap-[5px] uppercase">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex gap-[12px] items-center cursor-pointer group transition-all duration-300 ${
                    isActive ? "text-white" : "text-sixty"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Small square indicator */}
                    <div
                      className={`w-[7.03px] h-[7.03px] lg:w-[12px] lg:h-[12px] border-[1px] transition-all duration-300 ${
                        isActive
                          ? "border-white bg-primary"
                          : "border-sixty group-hover:border-primary group-hover:bg-primary"
                      }`}
                    ></div>

                    {/* Text */}
                    <p className="font-dmSans font-light text-[10.55px] leading-[13.73px] lg:text-[18px] group-hover:text-primary lg:leading-[23.44px] tracking-[0em] transition-all duration-300">
                      {item.name}
                    </p>
                  </>
                )}
              </NavLink>
            ))}
          </div>
          <Link to="/profile">
            <button
              className="flex justify-center cursor-pointer items-center w-[66.79px] h-[23.69px] lg:w-[114px] lg:h-[40px] gap-[6.44px] lg:gap-[11px] rounded-[5.86px] lg:rounded-[10px] bg-primary text-black
                  lg:px-[15px] lg:py-[4px] font-dmSans font-medium text-[10.32px] leading-[18.42px] lg:text-[17.61px] lg:leading-[31.45px] "
            >
              <img
                src={profile}
                alt=""
                className="w-[10.55px] h-[10.55px] lg:w-[18px] lg:h-[18px]"
              />
              Profile
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DesktopMenu;

