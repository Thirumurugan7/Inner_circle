import React, { useEffect, useState } from "react";
import bar from "../assets/images/bar.svg";
import topleft from "../assets/images/topleft.svg";
import topright from "../assets/images/topright.svg";
import bottomleft from "../assets/images/bottomleft.svg";
import bottomright from "../assets/images/bottomright.svg";
import helpplus from "../assets/images/helpplus.svg";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

const HelpedData = () => {
  const [helpData, setHelpData] = useState([]);
  const [maxNameLength, setMaxNameLength] = useState(20);

  // Function to truncate long names
  const truncateName = (name, maxLength) => {
    if (!name) return "";
    if (name.length <= maxLength) return name;
    return `${name.substring(0, maxLength)}...`;
  };

  // Update max name length based on screen size
  const updateMaxNameLength = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 640) {
      setMaxNameLength(15); // Mobile
    } else if (screenWidth < 1024) {
      setMaxNameLength(15); // Tablet
    } else {
      setMaxNameLength(20); // Desktop
    }
  };

  // Fetch help actions data
  const fetchHelpActions = async (limit = 3) => {
    try {
      const response = await axios.get(
        `https://inner-circle-nine.vercel.app/api/action/gethelpactions`,
        {
          params: { limit },
        }
      );

      // Format postedAt using date-fns
      const formattedData = response.data.data.map((item) => ({
        ...item,
        postedAt: formatDistanceToNow(new Date(item.createdAt), {
          addSuffix: true,
        }),
      }));
      console.log(formattedData);
      setHelpData(formattedData);
    } catch (error) {
      console.error("Error fetching help actions:", error);
    }
  };

  // Fetch data on component mount and set up event listener for resize
  useEffect(() => {
    fetchHelpActions();
    updateMaxNameLength();

    // Add event listener for screen size changes
    window.addEventListener("resize", updateMaxNameLength);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateMaxNameLength);
    };
  }, []);

  return (
    <div className="flex flex-wrap gap-[20px] lg:gap-[36px] mt-[14px] sm:mt-[23px]">
      {helpData.map((data) => (
        <div key={data.id} className="font-dmSans w-fit cursor-default">
          <div className="flex flex-col gap-[9px] h-fit py-[20px] px-[25px] w-fit sm:w-fit sm:h-[102.23px] lg:h-[145px] items-center justify-center relative sm:px-[20px] lg:px-[35px]">
            <h1 className="font-medium text-[25.76px] leading-[33.55px] tracking-[-1px] sm:text-[17.58px] sm:leading-[22.88px] md:tracking-[-0.04em] lg:text-[30px] lg:leading-[39.06px] lg:tracking-[-1.2px] text-center text-primary">
              {truncateName(data?.helpedBy?.name, maxNameLength)}
              <span className="text-thirty px-1"> helped </span>
              {truncateName(data?.helpedUser?.name, maxNameLength)}
            </h1>
            <div className="flex gap-[15px] items-center">
              <p className="text-[#B0B0B0] font-normal text-[18.85px] leading-[24.54px] tracking-[-1px] sm:text-[12.86px] sm:leading-[16.74px] sm:tracking-[-0.04em] lg:text-[21.95px] lg:leading-[28.57px] lg:tracking-[-0.88px] text-center">
                Gained {data?.pointsAllocated} Points
              </p>
              <img
                src={bar}
                alt="bar"
                className="w-[27.48px] h-[8.59px] sm:w-[18.75px] sm:h-[5.86px] lg:h-fit lg:w-fit"
              />
              <p
                className="font-normal text-[12.84px] leading-[16.72px] tracking-[-1px] h-[25.56px] sm:h-fit gap-[17.12px] px-[10.7px] py-[4.28px] sm:rounded-[17.52px] 
  sm:text-[8.76px] sm:leading-[11.41px] sm:tracking-[-0.04em]  lg:text-[14.95px] lg:leading-[19.47px] lg:tracking-[-0.6px] text-center text-black bg-primary rounded-full sm:py-[4.98px] sm:px-[12.46px] w-fit"
              >
                {data?.category}
              </p>
            </div>
            <img
              src={topleft}
              alt="topleft"
              className="top-0 left-0 absolute w-[46.69px] h-[39.72px] sm:h-[33.4px] sm:w-[39.25px] lg:h-fit lg:w-fit"
            />
            <img
              src={topright}
              alt="topright"
              className="top-0 right-0 absolute w-[46.69px] h-[39.72px] sm:h-[33.4px] sm:w-[39.25px] lg:h-fit lg:w-fit"
            />
            <img
              src={helpplus}
              alt="helpplus"
              className="top-[8px] right-[10px] sm:top-[14px]  sm:right-[14px] lg:top-[19px] lg:right-[17px] absolute h-[18px] w-[10px] sm:w-[8px] sm:h-[8px]  lg:h-fit lg:w-fit"
            />
            <img
              src={bottomleft}
              alt="bottomleft"
              className="bottom-0 left-0 absolute w-[46.69px] h-[39.72px] sm:h-[33.4px] sm:w-[39.25px] lg:h-fit lg:w-fit"
            />
            <img
              src={bottomright}
              alt="bottomright"
              className="bottom-0 right-0 absolute w-[46.69px] h-[39.72px] sm:h-[33.4px] sm:w-[39.25px] lg:h-fit lg:w-fit"
            />
          </div>
          <p className="text-[#B0B0B0] font-normal text-[11.05px] leading-[14.38px] tracking-[-1px] md:text-[10px] lg:text-[16px] sm:leading-[20.83px] sm:tracking-[-0.64px] text-right pt-[5px] lg:pt-[10px]">
            {data?.postedAt}
          </p>
        </div>
      ))}
    </div>
  );
};

export default HelpedData;
