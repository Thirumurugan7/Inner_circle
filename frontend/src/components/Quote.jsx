import React from 'react'
import ajeet from '../assets/images/ajeet.png'
import quote from "../assets/images/quote.png";
import mockdata from "../assets/images/mockdata.svg";

const Quote = () => {
  return (
    <div className="flex justify-center  mt-[2.7rem] sm:mt-[4.2rem] mb-[2rem]  sm:mb-[3.7rem]  lg:mb-[9.4rem]">
      <div className="flex gap-[18.32px] sm:gap-[25px] md:gap-[30px] lg:gap-[46px] ">
        <img
          src={ajeet}
          alt=""
          className="w-[145.74px] h-[150px]  sm:w-[220.44px] sm:h-[230.69px]  lg:mt-0  lg:h-fit lg:w-fit noiseeffect mix-blend-luminosity "
        />
        <div className="flex flex-col gap-[5.97px] sm:gap-[7px] md:gap-[10px] lg:gap-[15px] relative ">
          <p className="text-primary font-dmSans font-normal text-[12.74px] leading-[18.72px] tracking-[-0.04em]  sm:text-[18.75px] sm:leading-[27.54px] sm:tracking-[-0.04em] lg:text-[30px] lg:leading-[41px] xl:text-[32px]  xl:leading-[47px] lg:tracking-[-1px] w-[190.69px] sm:w-[298.22px]  lg:w-[460px] xl:w-[490px] sm:mt-[9px] lg:mt-[23px]">
            “Inner Circle is where visionaries come together to collaborate,
            grow, and redefine leadership. It's more than a community; it's a
            movement.”
          </p>
          <h1 className="thunder-normal font-normal text-[23.49px] leading-[25.49px] tracking-[0em]  sm:text-[34.57px] sm:leading-[37.5px]  lg:text-[59px] lg:leading-[64px]  text-primary opacity-50">
            – Ajeet Khurana
          </h1>
          <button
            className="w-[77.89px] h-[19.91px] gap-[3.98px] rounded-[3.98px] 
  px-[11.95px] py-[3.98px] font-dmSans font-medium text-[7.17px] 
  leading-[9.33px] tracking-[-0.04em]  lg:w-[194px] lg:h-[50px] lg:px-[30px] lg:rounded-[10px] uppercase  lg:py-[10px] text-[#050505] bg-primary text-center   lg:text-[18px]  flex items-center sm:w-[114.15px] sm:h-[29.29px] 
sm:py-[5.86px] sm:px-[17.58px]  
sm:rounded-[5.86px] 
sm:text-[10.55px] sm:leading-[13.73px] "
          >
            {" "}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfVyrKqie4AvORhTNWLwswhFG9G9pepRp3nE1g9H_jQDGA-UQ/viewform?usp=dialog"
              target="_blank"
              rel="noopener noreferrer"
              className=" w-full h-full flex items-center justify-center"
            >
              Join the Circle
            </a>
          </button>
          <img
            src={quote}
            alt=""
            className="hidden sm:block sm:absolute -top-8 right-3 noiseeffect mix-blend-luminosity"
          />
        </div>
      </div>
    </div>
  );
}

export default Quote
