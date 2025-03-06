import React from "react";
import Fone from "../assets/images/F1.svg";
import Ftwo from "../assets/images/F2.png";
import Fthree from "../assets/images/F3.png";
const Features = () => {
  const datas = [
    {
      id: 0,
      image: Fone,
      tit: "SBT Membership",
      des: "A Soulbound Token that solidifies your identity, builds your reputation, and grants you access to the Inner Circle.",
    },
    {
      id: 1,
      image: Ftwo,
      tit: "Your Personalized Hub",
      des: "A space to track your contributions, monitor rewards, and showcase your impact within the community.",
    },
    {
      id: 2,
      image: Fthree,
      tit: "Your Efforts Rewarded",
      des: "Receive recognition and rewards for your contributions to the community, driven by collective values and goals.",
    },
  ];
  return (
    <div className="flex justify-center px-[14px] mt-[1.5rem] sm:mt-0  lg:mb-[9.6rem]">
      <div className="flex flex-wrap sm:flex-row justify-center gap-[10px] sm:gap-[17.58px] lg:gap-[18px] w-full">
        {datas.map((data) => (
          <div
            key={data.id}
            className="w-[169.43px] h-[148.26px] rounded-[12.22px]  border-[0.42px]  sm:w-[234.36px] sm:h-[205.06px] sm:rounded-[16.9px] md:border-[0.59px] lg:w-[350px] lg:h-[320px] xl:w-[380px] noiseeffect xl:h-[350px] xl:rounded-[28.85px] sm:border-[1px] border-twenty bg-[#FFFFFF14] flex flex-col py-[17.51px] px-[10.18px] sm:px-[24.04px] justify-center"
          >
            <img
              src={data.image}
              alt=""
              className="w-[50.91px] h-[50.91px]  sm:w-[70.42px] sm:h-[69.94px]  lg:h-[100px] lg:w-[100px] xl:h-[120.19px] xl:w-[120.19px]"
            />
            <h1
              className="text-primary thunder-bold font-bold text-[17.11px] leading-[15.74px] tracking-[0px]  sm:text-[23.66px] sm:leading-[21.77px]  lg:text-[35px] lg:leading-[32px] xl:text-[40.38px] xl:leading-[37.15px] pt-[12.22px] sm:pt-[16.9px] lg:pt-[28.85px]"
            >
              {data.tit}
            </h1>
            <p className="text-sixty font-dmSans font-normal text-[7.33px] leading-[9.55px] tracking-[-0.2932px]  sm:text-[10.14px] sm:leading-[13.2px] lg:text-[15px] xl:text-[17.31px] lg:leading-[22.53px] sm:tracking-[-0.6924px] pt-[6.11px] sm:pt-[14.42px]">
              {data.des}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
