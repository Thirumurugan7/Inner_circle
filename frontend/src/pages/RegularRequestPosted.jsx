import React from "react";
import { Link } from "react-router-dom";

const RegularRequestPosted = () => {
  return (
    <div className="px-[4px] sm:px-12">
      <div className="flex flex-col items-center pt-[10rem] h-screen  bg-cover">
        <h1 className="thunder-bold font-bold text-[33.84px] leading-[31.13px] tracking-[-0.33px] sm:text-[50px] lg:text-[68px] sm:leading-[62.56px] sm:tracking-[0.68px] text-center text-primary">
          Your Help Request Has Been Posted!
        </h1>
        <p className="font-dmSans  font-normal text-[10.95px] leading-[14.26px] tracking-[-0.04em] sm:text-[17px] lg:text-[22px] sm:leading-[28.64px] sm:tracking-[-0.88px] text-center text-sixty pt-[4.98px] sm:pt-[10px] max-w-[391.16px] sm:max-w-[500px] lg:max-w-[786px] ">
          Your request is now live! Fellow members can see it and offer their
          support. Keep an eye on responses and engage with your community
        </p>
        <div className="flex gap-[9.95px] sm:gap-[20px] mt-[14.93px] sm:mt-[30px]">
          <Link to="/member-requests">
            <button className="font-dmSans font-medium text-[7.96px] leading-[12.15px] tracking-[0px]  sm:text-[16px] sm:leading-[24.41px]  cursor-pointer text-primary  w-[116.45px] h-[24.88px] sm:w-[234px] sm:h-[50px] gap-[3.86px] rounded-[3.86px]  border-[0.5px] p-[4.98px] sm:gap-[7.76px] sm:rounded-[7.76px] sm:border-[1px] border-white sm:p-[10px]">
              View All Member Requests
            </button>
          </Link>
          <Link to="/dashboard">
            <button className="font-dmSans font-medium text-[7.96px] leading-[12.15px] tracking-[0px]  sm:text-[16px] sm:leading-[24.41px]  cursor-pointer text-primary  w-[116.45px] h-[24.88px] sm:w-[234px] sm:h-[50px] gap-[3.86px] rounded-[3.86px]  border-[0.5px] p-[4.98px] sm:gap-[7.76px] sm:rounded-[7.76px] sm:border-[1px] border-white sm:p-[10px]">
              Go to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegularRequestPosted;
