import React from 'react'
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <div className="cursor-pointer">
      <Link to='/'>
        <h1 className="thunder-Extrabold font-extrabold text-[31.21px] md:text-[35.15px]  lg:text-[60px] leading-[28.71px] md:leading-[32.34px] lg:leading-[53.2px] tracking-0 sm:tracking-[.2px]  text-primary ">
          Inner Circle
        </h1>
        <p className="font-dmSans font-normal text-[#ffffff] opacity-50 text-[7.61px] leading-[9.91px] tracking-[-0.3px] md:text-[8.57px] lg:text-[14.60px] md:leading-[11.16px] lg:leading-[16.05px]  sm:-tracking-[.4px]">
          <span className="pr-0.5 text-[9px] md:text-[12px] lg:text-[15px]">
            +
          </span>{" "}
          The Network You Wish You Had.
        </p>
      </Link>
    </div>
  );
}

export default Logo
