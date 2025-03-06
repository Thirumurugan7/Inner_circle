import React from "react";
import loginstar from "../../assets/images/loginstar.svg";
import { Link} from "react-router-dom";
import { useSelector } from "react-redux";


const MobileMenu = ({ toggleMenu, isMenuOpen, setIsMenuOpen }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  console.log(currentUser);
  return (
    <div className="block relative sm:hidden">
      {!currentUser?.user ? (
        // 1. Show "MEMBER LOGIN" if no user is logged in
        <div className="sm:hidden flex flex-col items-center gap-[5px]">
          <div className="flex gap-[2.96px] items-center">
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
          <p className="text-sixty font-dmSans font-normal text-[8.3px] leading-[10.8px] lg:text-[14px] lg:leading-[18.23px] tracking-[-0.04em] text-center mt-[8px]">
            Already a member?
          </p>
        </div>
      ) : !currentUser?.user?.Refferal ? (
        // 2. Show "Enter Referral Code" if Referral is false
        <div>
          <Link
            to="/referral"
            className="text-black bg-white w-fit h-[25.85px] gap-[5.93px] rounded-[32px] px-[17.78px] py-[5.93px]  lg:h-[43px] lg:rounded-[54px] lg:px-[17.58px] lg:py-[10px] text-center font-dmSans font-normal text-[10.67px] leading-[13.89px] lg:text-[18px] lg:leading-[23.44px] tracking-[0%]"
          >
            Enter Referral Code
          </Link>
        </div>
      ) : currentUser?.user?.Refferal && !currentUser?.user?.minted ? (
        // 3. Show "Mint SBT" only if Referral is true and Minted is false
        <div>
          <Link
            to="/sbt-mint"
            className="text-black bg-white w-[112.56px] h-[25.85px] gap-[5.93px] rounded-[32px] px-[17.78px] py-[5.93px] lg:w-[190px] lg:h-[43px] lg:rounded-[54px] lg:px-[17.58px] lg:py-[10px] text-center font-dmSans font-normal text-[10.67px] leading-[13.89px] lg:text-[18px] lg:leading-[23.44px] tracking-[0%]"
          >
            Mint SBT
          </Link>
        </div>
      ) : (
        // 4. Show Menu if both Referral and Minted are true
        <>
          <button
            className="sm:hidden flex flex-col justify-center items-center z-50 cursor-pointer absolute  right-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white mb-1.5 transition-transform duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white mb-1.5 transition-opacity duration-300 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </>
      )}
    </div>
  );
};

export default MobileMenu;
