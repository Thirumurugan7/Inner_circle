import React from 'react'
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="flex flex-col gap-[8.55px] sm:gap-[15px] items-center pt-[11rem] min-h-screen">
      <h1 className="font-dmSans font-bold text-[60.4px] leading-[28.49px] tracking-[0.57px] sm:text-[62.1px] sm:leading-[29.29px] sm:tracking-[0.59px] lg:text-[106px] lg:leading-[50px] lg:tracking-[1px] text-center text-primary">
        404
      </h1>
      <p className="font-dmSans font-normal text-[18.23px] leading-[28.49px] tracking-[0.57px] sm:text-[18.75px] sm:leading-[29.29px] sm:tracking-[0.59px] lg:text-[32px] lg:leading-[50px] lg:tracking-[1px] text-center w-[259.26px] sm:w-[266.58px] lg:w-[455px] text-primary">
        The page you were looking for does not exist.{" "}
      </p>
      <div className="flex gap-[15px]">
        <Link to='/'>
          <button
            className="text-black cursor-pointer font-dmSans font-normal text-[9.12px] leading-[13.68px]   lg:text-[16px] lg:leading-[24px] tracking-[0px] text-center bg-primary w-[85.47px] h-[25.07px] rounded-[6.84px]  lg:w-[150px] lg:h-[44px] lg:rounded-[12px] sm:w-[87.88px] sm:h-[25.78px] sm:rounded-[7.03px]  
 sm:text-[9.37px] sm;leading-[14.06px] "
          >
            Back to home
          </button>
        </Link>
        <button
          className="text-white cursor-pointer font-dmSans font-normal text-[9.12px] leading-[13.68px]  lg:text-[16px] lg:leading-[24px] tracking-[0px] text-center bg-black w-[85.47px] h-[25.07px] rounded-[6.84px]  lg:w-[150px] lg:h-[44px] lg:rounded-[12px] border-primary border-[0.59px] sm:w-[87.88px] sm:h-[25.78px] sm:rounded-[7.03px]  
 sm:text-[9.37px] sm:leading-[14.06px] "
        >
          Contact us
        </button>
      </div>
    </div>
  );
}

export default PageNotFound
