import React from "react";
import mark from "../assets/images/Mark.svg";
import pluscircle from "../assets/images/pluscircle.svg";
import HelpRequestTable from "../components/HelpRequestTable";
import { Link } from "react-router-dom";

const AllRequest = () => {
  return (
    <div className="px-[9px] sm:px-[60px] lg:px-[80px] pb-[11rem] min-h-screen h-full">
      <div className="flex justify-between gap-[20px]">
        <div className="flex flex-col gap-[18px] sm:gap-[20px]">
          <div className="flex gap-[10px] items-center">
            <img
              src={mark}
              alt=""
              className="h-[32.52px] w-[32.52px] sm:h-[44px] sm:w-[44px]"
            />
            <p className="text-primary thunder-medium font-medium text-[31.04px] leading-[28.56px] sm:text-[42px] sm:leading-[38.64px]">
              Active Help Requests
            </p>
          </div>
          <p className="font-dmSans font-medium text-[14px] leading-[18.23px] w-[305.33px] sm:w-[400px] lg:w-full sm:text-[18px] md:text-[22px] sm:leading-[28.64px] tracking-[-0.04em] text-primary">
            See what fellow members need help with and contribute to the
            community.
          </p>
        </div>
        <Link to="/ask-for-help">
          <button className="text-black cursor-pointer font-dmSans hidden sm:flex font-normal text-[14px] md:text-[16px] leading-[24.41px] tracking-[0] bg-primary w-[175.17px] h-[45px] gap-[7.76px] rounded-[7.76px] p-[10px]  items-center justify-center">
            <img src={pluscircle} alt="" />
            Ask for Help Now
          </button>
        </Link>
      </div>

      <HelpRequestTable />
    </div>
  );
};

export default AllRequest;
