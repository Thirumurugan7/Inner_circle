import React from 'react'
import { community } from '../constant';
const CommunityDes = () => {
    
  return (
    <div className="mx-auto px-[14px] pt-[3rem] sm:pt-[5.5rem] lg:pt-[8.9rem]">
      <div className="flex flex-col gap-[7.86px] sm:gap-[20px] justify-center items-center">
        <h1 className="thunder-bold font-bold text-[34px] leading-[31.28px] sm:text-[43px] sm:leading-[37px]  md:text-[52.73px] md:leading-[43.81px] lg:text-[78px] xl:text-[90px]   lg:leading-[60px]  xl:leading-[87px] tracking-[0] text-center text-primary  w-[320px] sm:w-[600px] md:w-[700px] lg:w-[1000px] xl:w-[1303.5px]">
          The community where leaders grow, collaborate, and redefine the
          future.
        </h1>
        <p className="font-dmSans font-normal text-[10px] leading-[13.02px] tracking-[-0.4px]   sm:text-[12.89px] sm:leading-[16.78px] md:tracking-[-0.04em]  lg:text-[20px] lg:leading-[26px] xl:text-[22px] xl:leading-[28.64px]  sm:tracking-[-0.04em]  text-sixty w-[345.65px]  sm:w-[515.58px] lg:w-[800px] xl:w-[880px] text-center">
          Inner Circle is where trust meets collaboration, and growth is powered
          by a shared purpose. This isn't for everyone—it’s for those who dare
          to lead, build, and thrive together.
        </p>
      </div>
      <div
        className="flex flex-wrap gap-[15px] sm:gap-[15.23px] lg:gap-[26px] mx-auto pt-[20px] sm:pt-[2rem] lg:mt-[58px] justify-center noiseeffect"
      >
        {community.map((data) => (
          <div key={data.id} className="communitybg w-[153px] h-[113.14px]  sm:w-[209.16px] sm:h-[154.67px] lg:w-[300px] lg:h-[225px] lg:p-[27.54px]  xl:w-[357px] xl:h-[264px] py-[19.71px] px-[20.14px] flex flex-col items-center justify-center">
            <h3 className="text-primary thunder-bold font-bold  text-[21.99px] leading-[20.23px]  sm:text-[30.06px] sm:leading-[27.65px] lg:text-[45px] lg:leading-[41px] xl:text-[51.3px] xl:leading-[47.2px] tracking-[0%] text-center md:w-[154px] lg:w-[263px]  pb-[8px]">
              {data.tit}
            </h3>
            <p className="text-sixty font-dmSans font-normal text-[7.71px] leading-[10.04px] tracking-[-0.31px] sm:text-[10px] sm:leading-[14px] md:text-[10.55px] md:leading-[13.73px] md:tracking-[-0.04em]  lg:text-[14px] lg:leading-[19px] xl:text-[18px] xl:leading-[23.44px] sm:tracking-[-0.04em] text-center  md:w-[154px] lg:w-[263px] ">
              {data.des}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommunityDes
