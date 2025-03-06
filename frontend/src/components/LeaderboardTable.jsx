import React from "react";
import one from "../assets/images/one.svg";
import two from "../assets/images/two.svg";
import three from "../assets/images/three.svg";
import moment from "moment";
const rankIcons = [one, two, three]; // Store rank images

const LeaderboardTable = ({contributions}) => {
 
  return (
    <div className="w-full xl:w-[1004.73px]">
      <div className="relative  border-twenty border-t-[0.55px] border-b-[0.55px] flex  px-1 sm:px-5 justify-between items-center font-dmSans font-normal text-[8.93px] leading-[11.62px] tracking-[-0.04em] sm:text-[14px] md:text-[18px] sm:leading-[23.44px] sm:divacking-[-0.04em] text-center text-fifty py-3 sm:py-5">
        <div className=" w-[126px]">Rank</div>
        <div className="w-[126px]">Member Name</div>
        <div className="w-[126px]">Telegram</div>
        <div className="w-[154px]">Total Points</div>
        <div className=" w-[211px]">Last Activity</div>
        {/* Header top left dot */}
        <div className="absolute left-0 top-0  w-[1.58px] h-[2.64px] sm:w-[4.22px] sm:h-[5.33px] bg-sixty" />
        {/* Header top right dot */}
        <div className="absolute right-0 top-0  w-[1.58px] h-[2.64px] sm:w-[4.22px] sm:h-[5.33px] bg-sixty" />
        {/* Header bottom left dot */}
        <div className="absolute left-0 -bottom-[2px] sm:-bottom-[3px] w-[1.58px] h-[2.64px] sm:w-[4.22px] sm:h-[5.33px] bg-sixty" />
        {/* Header bottom right dot */}
        <div className="absolute right-0 -bottom-[2px] sm:-bottom-[3px] w-[1.58px] h-[2.64px] sm:w-[4.22px] sm:h-[5.33px] bg-sixty" />
      </div>

      {/* Table Body */}
      <div>
        {contributions.map((contribution, index) => (
          <div
            key={index}
            className="relative border-twenty  border-b-[0.55px] flex px-1 sm:px-5 justify-between items-center font-dmSans font-normal text-[8.93px] leading-[11.62px] tracking-[-0.04em] sm:text-[14px] md:text-[18px] sm:leading-[23.44px] sm:divacking-[-0.04em] text-center text-white py-3 sm:py-5"
          >
            {/* Row bottom left dot */}
            <div className="absolute left-0 -bottom-[2px] sm:-bottom-[3px] w-[1.58px] h-[2.64px] sm:w-[4.22px] sm:h-[5.33px] bg-sixty" />
            {/* Row bottom right dot */}
            <div className="absolute right-0 -bottom-[2px] sm:-bottom-[3px] w-[1.58px] h-[2.64px] sm:w-[4.22px] sm:h-[5.33px] bg-sixty" />
            {/* Rank Column */}
            <div className=" w-[126px]">
              {index < 3 ? (
                <img
                  src={rankIcons[index]}
                  alt={`Rank ${index + 1}`}
                  className="w-[10.4px] h-[15.48px] sm:w-[25px] sm:h-[25px] mx-auto"
                />
              ) : (
                <span className="text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>
              )}
            </div>

            {/* Other Columns */}
            <div className="w-[126px]">{contribution?.name}</div>
            <div className="w-[126px]">{contribution?.telegram}</div>
            <div className=" w-[154px]">{contribution?.points}</div>
            <div className=" w-[211px] capitalize">
              {contribution?.lastActivity}
              {" . "}
              <span className="text-fourty">
                {" "}
                {moment(contribution?.lastUpdated).fromNow()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardTable;
