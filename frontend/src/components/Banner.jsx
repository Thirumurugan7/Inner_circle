import React from 'react'

const Banner = () => {
  return (
    <div className="banner   w-full  lg:w-[1262px] sm:h-[325.75px] lg:h-[556px] rounded-[20px] mx-auto mt-[45px] sm:my-[25px] lg:my-[35px] p-[5px]  lg:py-[10px] sm:px-[15px] flex flex-col justify-between">
      <div className="flex justify-between">
        <div
          className="text-[7.12px] leading-[9.27px] tracking-[-0.35px] 
            h-[13.43px] gap-[8.87px] sm:text-[9.37px]
           rounded-[13.3px] sm:w-fit sm:h-[17.8px]
           py-[2.22px] px-[5.54px]   top-[10px] left-[13px] sm:px-[12.46px] sm:gap-[19.94px] sm:rounded-[29.91px] text-center sm:py-[3.9px] bg-primary opacity-50"
        >
          Collaboration
        </div>
        <div
          className="text-[7.12px] leading-[9.27px] tracking-[-0.35px] 
            h-[13.43px] gap-[8.87px] sm:text-[9.37px]
           rounded-[13.3px] sm:w-fit sm:h-[17.8px]
           py-[2.22px] px-[5.54px]   top-[10px] left-[13px] sm:px-[12.46px] sm:gap-[19.94px] sm:rounded-[29.91px] text-center sm:py-[3.9px] bg-primary opacity-50"
        >
          Contribution
        </div>
      </div>
      <div className="flex flex-col  items-center justify-center">
        <h1 className="thunder-bold font-bold text-[39.59px] leading-[36.92px] sm:text-[45px] sm:leading-[46px] md:text-[52.14px] md:leading-[48.63px] lg:text-[65px] xl:text-[89px] xl:leading-[90px] tracking-[0%] text-center text-primary uppercase">
          The Few. The Bold. The Circle.
        </h1>
        <p className="text-sixty font-dmSans font-light text-[9.79px] leading-[12.74px] tracking-[-0.04em]  sm:text-[14px] md:text-[12.89px] md:leading-[16.78px]  lg:text-[18px]  xl:text-[22px] sm:leading-[28.64px] sm:tracking-[-4%] text-center">
          Where growth meets trust, and leaders find their place.
        </p>
        <button
          className="w-[97.69px] h-[22.24px] gap-[4.45px] 
           rounded-[24.02px] px-[13.35px] py-[4.45px] 
           text-[8.01px] leading-[10.43px] tracking-[-0.04em] text-black uppercase mt-[8.9px] sm:mt-[20px] bg-white  lg:w-[219px] sm:w-fit sm:h-fit lg:h-[50px]  text-center font-dmSans font-normal  lg:text-[14px] xl:text-[18px]  sm:tracking-[0%] sm:py-[5px] lg:py-[10px]
           p-[5.86px] sm:px-[17.58px] sm:rounded-[31.64px]  sm:text-[10.55px] sm:leading-[13.73px]"
        >
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfVyrKqie4AvORhTNWLwswhFG9G9pepRp3nE1g9H_jQDGA-UQ/viewform?usp=dialog"
            target="_blank"
            rel="noopener noreferrer"
            className=" w-full h-full flex items-center justify-center"
          >
            Become a member
          </a>
        </button>
      </div>

      <div className="flex justify-between">
        <div
          className="text-[7.12px] leading-[9.27px] tracking-[-0.35px] 
            h-[13.43px] gap-[8.87px] sm:text-[9.37px]
           rounded-[13.3px] sm:w-fit sm:h-[17.8px]
           py-[2.22px] px-[5.54px]   top-[10px] left-[13px] sm:px-[12.46px] sm:gap-[19.94px] sm:rounded-[29.91px] text-center sm:py-[3.9px] bg-primary opacity-50"
        >
          Membership
        </div>
        <div
          className="text-[7.12px] leading-[9.27px] tracking-[-0.35px] 
            h-[13.43px] gap-[8.87px] sm:text-[9.37px]
           rounded-[13.3px] sm:w-fit sm:h-[17.8px]
           py-[2.22px] px-[5.54px]   top-[10px] left-[13px] sm:px-[12.46px] sm:gap-[19.94px] sm:rounded-[29.91px] text-center sm:py-[3.9px] bg-primary opacity-50"
        >
          Growth Network
        </div>
      </div>
    </div>
  );
}

export default Banner
