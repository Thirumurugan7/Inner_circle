import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Hero = () => {
  const currentUser = useSelector((state) => state.user.currentUser);

  return (
    <div className="mx-auto py-[28px] sm:py-[20px]  lg:py-[48px] flex flex-col items-center gap-[11.32px] md:gap-[17.58px] lg:gap-[30px]">
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-[2.64px] md:gap-[4.1px] lg:gap-[10px] thunder-bold font-bold text-[48px] leading-[47.84px]  sm:text-[70px] sm:leading-[70px] md:text-[82.02px] md:leading-[75.46px]   lg:text-[110px] xl:text-[140px] lg:leading-[100px] xl:leading-[128.8px] tracking-[0%] text-primary text-center">
          <h1>A Circle of Trust</h1>
          <h1>Built to Grow Together.</h1>
        </div>

        <p className="text-sixty font-dmSans w-[319.47px] sm:w-[400px] font-normal text-[10px] md:text-[12.89px]  md:leading-[16.78px] md:w-[496.25px] sm:leading-[18px] leading-[13.02px] tracking-[-0.4px] lg:text-[18px] xl:text-[22px] lg:leading-[28.64px]  sm:tracking-[-0.04em] text-center pt-[5.66px] sm:pt-[15px] lg:w-[720px] xl:w-[847px]">
          Inner Circle is more than a network—it's where trust, growth, and
          collaboration come alive. As a member, you hold governance power
          within the Inner Circle DAO.
        </p>
      </div>
      <div className="flex flex-col gap-[10px] md:gap-[15px] lg:gap-[20px]  items-center">
        <button
          className="text-black bg-white w-[123.63px] h-[31px] gap-[3.77px] rounded-[20.37px] 
           px-[11.32px] pt-[3px] cursor-pointer
           font-dmSans font-medium text-[12px] leading-[15.62px] tracking-[-0.48px] sm:text-[14px] sm:leading-[16px] sm:rounded-[54px] md:w-[128.15px] md:h-[29.29px] md:gap-[5.86px] md:rounded-[31.64px]  
           md:px-[17.58px] md:py-[5.86px] md:text-[10.55px] md:leading-[13.73px] md:tracking-[-0.04em] lg:w-[211px] lg:h-[50px] text-center lg:text-[18px] lg:leading-[23.44px] sm:py-[9px] lg:px-[13px] sm:w-fit sm:h-fit lg:py-[10px]"
        >
          {currentUser && currentUser?.user ? (
            <Link
              to="/dashboard"
              className="w-full h-full flex items-center justify-center"
            >
              GO TO DASHBOARD
            </Link>
          ) : (
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfVyrKqie4AvORhTNWLwswhFG9G9pepRp3nE1g9H_jQDGA-UQ/viewform?usp=dialog"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-full flex items-center justify-center"
            >
              JOIN INNER CIRCLE
            </a>
          )}
        </button>

        {(!currentUser || !currentUser?.user) && (
          <p className="text-sixty font-dmSans font-normal text-[10px] leading-[13.02px] tracking-[-0.4px] sm:text-[12px] sm:leading-[17px] md:text-[14px] md:leading-[18px] lg:text-[18px] lg:leading-[23.44px] sm:tracking-[-0.04em] text-center">
            Got a Referral Code?
            <span className="text-primary pl-[4px]">
              <Link to="/referral">Enter Here →</Link>
            </span>{" "}
          </p>
        )}
      </div>
    </div>
  );
};

export default Hero;
