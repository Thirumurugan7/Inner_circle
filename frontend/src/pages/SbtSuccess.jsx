import React from 'react'
import { Link } from "react-router-dom";
const SbtSuccess = () => {
  return (
    <div className="px-[4px] sm:px-12 sbtsuccessbg">
      <div className="flex flex-col items-center justify-center h-screen  bg-cover">
        <h1 className="hidden sm:block thunder-bold font-bold text-[33.84px] leading-[31.13px] tracking-[-0.33px] sm:text-[50px] lg:text-[68px] sm:leading-[62.56px] sm:tracking-[0.68px] text-center text-primary">
          Your SBT is Minted! Welcome to the Inner Circle.
        </h1>
        <div className=" sm:hidden flex flex-col thunder-bold font-bold text-[33.84px] leading-[31.13px] tracking-[-0.33px] sm:text-[50px] lg:text-[68px] sm:leading-[62.56px] sm:tracking-[0.68px] text-center text-primary">
          <h1>Your SBT is Minted! </h1>
          <h1>Welcome to the Inner Circle.</h1>
        </div>
        <p className="font-dmSans px-[5px] font-normal text-[10.95px] leading-[14.26px] tracking-[-0.04em] sm:text-[17px] lg:text-[22px] sm:leading-[28.64px] sm:tracking-[-0.88px] text-center text-sixty pt-[4.98px] sm:pt-[10px] max-w-[391.16px] sm:max-w-[500px] lg:max-w-[786px] ">
          You now hold your exclusive Soulbound Token – your proof of trust,
          reputation, and contribution within the Inner Circle.
        </p>
        <div className="flex gap-[9.95px] sm:gap-[20px] mt-[14.93px] sm:mt-[30px]">
          <Link to="/predefined-help-request">
            <button className="font-dmSans font-medium text-[7.96px] leading-[12.15px] tracking-[0px]  sm:text-[16px] sm:leading-[24.41px]  cursor-pointer text-primary  w-fit h-fit gap-[3.86px] rounded-[3.86px]  border-[0.5px] p-[4.98px] sm:gap-[7.76px] sm:rounded-[7.76px] sm:border-[1px] border-white sm:p-[10px]">
              Continue to Ask for Help  →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SbtSuccess
