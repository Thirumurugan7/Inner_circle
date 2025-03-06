import React from "react";

const PointsandCondivibution = ({ pointsHistory, Loading }) => {
  return (
    <div>
      <div className="w-full xl:w-[1004.73px]">
        <div className="relative items-center gap-1 border-twenty border-t-[0.55px] border-b-[0.55px] flex px-1 sm:px-3 md:px-5 justify-between font-dmSans font-normal text-[10.4px] sm:text-[10.55px] lg:text-[18px] md:leading-[23.44px] tracking-[-0.04em] text-center text-fifty py-3 sm:py-4 lg:py-6">
          <div className="w-[110px]">Date</div>
          <div className="w-[131px]">Points Earned</div>
          <div className="w-[130px]">Category</div>
          <div className="w-[154px]">Given By</div>
          <div className="w-[231px]">Description</div>
          <div className="absolute left-0 top-0 w-[1.58px] h-[2.64px] sm:w-[4.22px] sm:h-[5.33px] bg-sixty" />
          <div className="absolute right-0 top-0 w-[1.58px] h-[2.64px] sm:w-[4.22px] sm:h-[5.33px] bg-sixty" />
          <div className="absolute left-0 -bottom-[2px] sm:-bottom-[3px] w-[1.58px] h-[2.64px] sm:w-[4.22px] sm:h-[5.33px] bg-sixty" />
          <div className="absolute right-0 -bottom-[2px] sm:-bottom-[3px] w-[1.58px] h-[2.64px] sm:w-[4.22px] sm:h-[5.33px] bg-sixty" />
        </div>

        {Loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sixty"></div>
          </div>
        ) : pointsHistory.length === 0 ? (
          <div className="flex justify-center items-center py-10 text-fifty">
            No points gained yet
          </div>
        ) : (
          <div>
            {pointsHistory.map((record, index) => (
              <div
                key={index}
                className="relative border-twenty border-b-[0.55px] gap-1 flex px-1 sm:px-3 md:px-5 justify-between items-center font-dmSans font-normal text-[10.4px] sm:text-[10.55px] lg:text-[18px] md:leading-[23.44px] tracking-[-0.04em] text-center text-white py-3 sm:py-4 lg:py-6"
              >
                <div className="w-[110px]">{record?.date}</div>
                <div className="w-[131px]">{record?.pointsEarned}</div>
                <div className="w-[130px]">{record?.category}</div>
                <div className="w-[154px]">{record?.givenBy}</div>
                <div className="w-[231px] capitalize">
                  {record?.description}
                </div>
                <div className="absolute left-0 -bottom-[2px] sm:-bottom-[3px] w-[1.58px] h-[2.64px] sm:w-[4.22px] sm:h-[5.33px] bg-sixty" />
                <div className="absolute right-0 -bottom-[2px] sm:-bottom-[3px] w-[1.58px] h-[2.64px] sm:w-[4.22px] sm:h-[5.33px] bg-sixty" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PointsandCondivibution;
