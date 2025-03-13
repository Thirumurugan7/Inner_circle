import React, { useState, useEffect, useRef } from "react";
import topleft from "../assets/images/topleft.svg";
import topright from "../assets/images/topright.svg";
import bottomleft from "../assets/images/bottomleft.svg";
import bottomright from "../assets/images/bottomright.svg";
import helpplus from "../assets/images/helpplus.svg";
import bar from "../assets/images/bar.svg";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

const CAROUSEL_SPEED = 3000;

const ActivityCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const cardRef = useRef(null);

 
  const [helpdata, setHelpdata] = useState([]);
   const extendedData = [...helpdata, ...helpdata];
   // Fetch help actions data
   const fetchHelpActions = async (limit = 6) => {
     try {
       const response = await axios.get(
         `http://localhost:5001/api/action/gethelpactions`,
         {
           params: { limit },
         }
       );

       // Format postedAt using date-fns
       
       console.log(response.data);
       setHelpdata(response.data.data);
     } catch (error) {
       console.error("Error fetching help actions:", error);
     }
   };

   // Fetch data on component mount
   useEffect(() => {
     fetchHelpActions();
   }, []);
  // Detect card width on mount and window resize
  useEffect(() => {
    const updateCardWidth = () => {
      if (cardRef.current) {
        setCardWidth(cardRef.current.offsetWidth);
      }
    };

    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);

    return () => window.removeEventListener("resize", updateCardWidth);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, CAROUSEL_SPEED);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentIndex === helpdata.length) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 500);
    }
  }, [currentIndex]);

  const translateValue = currentIndex * (cardWidth + 80);
  // currentIndex * (cardWidth + 40) - cardWidth / 2;

  const Dot = () => (
    <div className="absolute top-1/2 -translate-y-1/2 -right-[16px] md:-right-[20px] lg:-right-[23px] z-10">
      <div
        className="w-[4.43px] h-[4.43px] md:w-[5.86px] md:h-[5.86px] lg:w-[10px] lg:h-[10px] rounded-full bg-primary"
      ></div>
    </div>
  );

  return (
    <div className="relative w-full ml-[2re] mr-[2rem] overflow-hidden sm:mt-[2rem] mb-[4rem] sm:mb-[5rem] lg:mb-[10rem]">
      <div
        className={`flex  gap-[28.16px] md:gap-[33px] lg:gap-[40px] mt-[23px] transition-transform ${
          isTransitioning ? "duration-500 ease-in-out" : "transition-none"
        }`}
        style={{
          transform: `translateX(-${translateValue}px)`,
        }}
      >
        {extendedData.map((data, index) => (
          <div
            key={index}
            ref={index === 0 ? cardRef : null} // Attach ref to the first card
            className="font-dmSans cursor-default flex-shrink-0 relative"
          >
            <div className="flex flex-col gap-[9px] h-[64.24px] md:h-[84.95px] lg:h-[145px] items-center justify-center relative px-[20px] sm:w-fit md:px-[25px] lg:px-[35px]">
              <h1 className="font-medium text-[13.29px] leading-[17.31px] tracking-[-0.04em] md:text-[17.58px] md:leading-[22.88px] md:tracking-[-0.04em] lg:text-[30px] lg:leading-[39.06px] lg:tracking-[-1.2px] text-center text-primary">
                {data?.helpedBy?.name}
                <span className="text-thirty px-1"> helped </span>
                {data?.helpedUser?.name}
              </h1>
              <div className="flex gap-[6.65px] sm:gap-[15px] items-center">
                <p className="text-[#B0B0B0] font-normal text-[9.72px] leading-[12.66px] tracking-[-0.04em] md:text-[12.86px] md:leading-[16.74px] md:tracking-[-0.04em] lg:text-[21.95px] lg:leading-[28.57px] lg:tracking-[-0.88px] text-center">
                  Gained {data?.pointsAllocated} Points
                </p>
                <img
                  src={bar}
                  alt=""
                  className="w-[14.18px] h-[4.43px] md:w-[18.75px] md:h-[5.86px] sm:w-fit sm:h-fit"
                />
                <p
                  className="font-normal gap-[8.83px] rounded-[13.25px] px-[5.52px] py-[2.21px] font-dmSans text-[6.62px] leading-[8.63px] tracking-[-0.04em]  md:gap-[11.68px] md:rounded-[17.52px] 
  md:text-[8.76px] md:leading-[11.41px] md:tracking-[-0.04em]  lg:text-[14.95px] h-fit lg:leading-[19.47px] lg:tracking-[-0.6px] text-center text-black bg-primary sm:rounded-full sm:py-[4.98px] sm:px-[12.46px] w-fit"
                >
                  {data?.category}
                </p>
              </div>
              <img
                src={topleft}
                alt=""
                className="top-0 left-0 absolute w-[29.68px] h-[25.25px] md:h-[33.4px] md:w-[39.25px] lg:h-fit lg:w-fit"
              />
              <img
                src={topright}
                alt=""
                className="top-0 right-0 absolute  w-[29.68px] h-[25.25px] md:h-[33.4px] md:w-[39.25px] lg:h-fit lg:w-fit"
              />
              <img
                src={helpplus}
                alt=""
                className="top-[6px] right-[8px] lg:top-[19px] md:top-[14px]  md:right-[14px] lg:right-[17px] absolute h-[6px] w-[6px] md:w-[8px] md:h-[8px] lg:h-fit lg:w-fit"
              />
              <img
                src={bottomleft}
                alt=""
                className="bottom-0 left-0 absolute  w-[29.68px] h-[25.25px] md:h-[33.4px] md:w-[39.25px] lg:h-fit lg:w-fit"
              />
              <img
                src={bottomright}
                alt=""
                className="bottom-0 right-0 absolute  w-[29.68px] h-[25.25px] md:h-[33.4px] md:w-[39.25px] lg:h-fit lg:w-fit"
              />
            </div>
            {index < extendedData.length - 1 && <Dot />}
          </div>
        ))}
      </div>
      <div className="hidden lg:block sm:absolute top-0 left-0 h-full w-[10rem] bg-gradient-to-r from-black via-black/70 to-black/70 pointer-events-none" />
      <div className="hidden lg:block sm:absolute top-0 right-0 h-full w-[10rem] bg-gradient-to-r from-black/70 via-black/70 to-black pointer-events-none" />
    </div>
  );
};

export default ActivityCarousel;
