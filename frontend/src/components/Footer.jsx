import React from "react";
import collaborate from "../assets/images/Collaborate.svg";
import reachtop from "../assets/images/reachtop.svg";
import { navigationData } from "../constant";

const Footer = () => {
  

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  

  return (
    <div>
      <div className="bg-white w-full h-[178px] sm:h-[200px] md:h-[300px] lg:h-[400px] xl:h-[461px] rounded-t-[24.08px] sm:rounded-t-[80px] pt-[1.5rem] md:pt-[3rem] lg:pt-[5.5rem] mt-[4.6rem] z-50">
        <img src={collaborate} alt="" className="w-full" />
      </div>
      <div className="bg-black flex flex-col justify-between rounded-t-[24.08px] h-[201px] sm:h-fit sm:rounded-t-[70px] pt-[20px] sm:pt-[65px] -mt-[4rem] md:-mt-[3rem] lg:-mt-[4.5rem] px-[5px] sm:px-[10px] md:px-[12px] lg:px-[25px]">
        <div className="flex gap-[8px] justify-between">
          <p className="w-[110.43px] sm:w-[206px] lg:w-[353px] font-dmSans font-normal text-[7.2px] leading-[9.39px] tracking-[0px] sm:text-[13.48px] sm:leading-[17.58px] lg:text-[23px] lg:leading-[30px] text-primary">
            It’s not just a group. It’s vision; connection; purpose. A network
            built to amplify what’s possible.
          </p>
          <div className="flex justify-between gap-[17px] sm:gap-[25px] md:gap-[50px] lg:gap-[70px]">
            {navigationData.map((section, index) => (
              <div key={index} className="flex flex-col gap-[9.27px]">
                <h2 className="text-thirty font-dmSans font-normal text-[9.81px] leading-[10.9px] sm:text-[10.55px] lg:text-[18px] sm:leading-[20px] tracking-[0px]">
                  {section.section}
                </h2>
                <div className="flex flex-col">
                  {section.items.map((item, itemIndex) => (
                    <a
                      key={itemIndex}
                      href={item.link}
                      target={item.external ? "_blank" : "_self"}
                      rel={item.external ? "noopener noreferrer" : ""}
                      className="  cursor-pointer mt-[3.82px] lg:mt-[7px] text-primary flex items-center gap-[2px] font-dmSans font-normal text-[9.81px] leading-[10.9px] sm:text-[10.55px] lg:text-[18px] lg:leading-[20px] tracking-[0px] transition-colors duration-300 "
                    >
                      <div className="h-[6.54px] w-[6.54px] lg:w-[12px] lg:h-[12px] border-[1px] border-primary group-hover:border-primary group-hover:bg-primary transition-all duration-300"></div>
                      <p className="pl-[4.1px]">{item.name}</p>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <a href="#top" className="cursor-pointer">
            <img
              src={reachtop}
              alt="Scroll to top"
              className="hidden sm:block w-[34.24px] h-[34.24px] lg:w-fit lg:h-fit"
            />
          </a>
        </div>

        <div className="text-primary flex flex-col-reverse mx-auto sm:flex-row items-start gap-[10px] sm:gap-0 sm:pt-[3rem] md:pt-[4rem] lg:mt-[10.5rem]">
          <h1 className="thunder-Extrabold text-center font-extrabold text-[99.84px] max-h-[55%] sm:h-fit leading-[91.14px] w-full md:text-[130px] md:leading-[145px] lg:text-[200px] lg:leading-[215px] xl:text-[260px] xl:leading-[275px] tracking-[0px]">
            INNER CIRCLE
          </h1>
          <p className="w-[77.05px] h-[14px] text-[6.19px] leading-[6.88px] font-dmSans font-normal sm:text-[10.55px] sm:leading-[13px] lg:text-[18px] lg:leading-[20px] sm:w-[224px] sm:mt-[2.7rem] md:mt-[4.5rem] lg:mt-[7.4rem] xl:mt-[10.5rem] sm:ml-[2.3rem]">
            ©2025 Inner Circle. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
