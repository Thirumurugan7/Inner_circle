import React from 'react'
import sidearrow from '../assets/images/sidearrow.png'
import { dollarinner } from '../constant';
const DollarInner = () => {
  const data = [
    {
      id: 0,
      tit: "Earn It ",
      des: "Contribute, collaborate, and grow to earn $INNER CIRCLE.",
    },
    {
      id: 1,
      tit: "Stake It",
      des: "Strengthen your governance power in decision-making.",
    },
    {
      id: 2,
      tit: "Use It",
      des: "Unlock exclusive perks, rewards, and access within the ecosystem.",
    },
  ];
  return (
    <div className="border-[1px] border-[#FFFFFF33] lg:rounded-[20px] dollarinnerbg rounded-[10.31px] sm:rounded-0   w-[360px] h-[195px] sm:h-fit  py-[23.2px] pl-[16.5px] lg:h-[390px] lg:w-[1249px] sm:px-[15px] sm:py-[45px] mt-[1.5rem] sm:mt-[4rem] lg:mt-[8.5rem] mb-[2rem] sm:mb-[5rem] lg:mb-[2.3rem]  ">
      <div className="thunder-bold font-bold flex items-baseline gap-[10px]">
        <h1 className="text-primary  text-[37.61px] sm:text-[40px] sm:leading-[37px] leading-[34.6px] md:text-[50px] md:leading-[45px] lg:text-[72.95px] lg:leading-[67.11px] tracking-[0px]">
          $INNER
        </h1>
        <h1 className="text-fourty text-[19.59px] leading-[18.03px] sm:text-[18px] sm:leading-[17px] md:text-[24px]  md:leading-[23px] lg:text-[38px] lg:leading-[34.96px] tracking-[0px]">
          (Coming soon!!)
        </h1>
      </div>
      <p className="text-sixty thunder-medium font-medium text-[16.5px] leading-[15.18px] sm:text-[20px] sm:leading-[18.5px]  md:text-[25px] md:leading-[22px] lg:text-[32px] lg:leading-[29.44px] tracking-[0px] pt-[5.16px] sm:pt-[10px]">
        A Token Built for Those Who Build the Circle
      </p>
      <p className="text-sixty font-dmSans font-normal text-[9.28px] leading-[12.08px] sm:text-[12px] sm:leading-[16px] md:text-[16px]  md:leading-[18px] lg:text-[18px] lg:leading-[23.44px] tracking-[0px] sm:w-[450px] lg:w-[704px] pt-[10.31px] sm:pt-[14px] md:pt-[20px]">
        <span className="text-primary">$INNER CIRCLE </span>is more than just a
        token—it’s a symbol of contribution, reputation, and trust within the
        Inner Circle DAO.
      </p>
      <div className="pt-[10.31px] sm:pt-[15px] lg:pt-[20px] flex flex-col gap-[7px]">
        {dollarinner.map((dat) => (
          <div key={dat.id} className="flex items-center gap-[5px] sm:gap-[9px] md:gap-[14px]">
            <img
              src={sidearrow}
              alt=""
              className="h-[13.92px] w-[13.92px] sm:w-[15px] sm:h-[15px] lg:h-fit lg:w-fit"
            />
            <div className="flex items-center">
              {" "}
              <h1 className="text-primary thunder-bold font-bold text-[14.44px] leading-[13.28px] sm:text-[20px] sm:leading-[18px] lg:text-[28px] lg:leading-[25.76px] tracking-[0px]">
                {dat.tit}
              </h1>
              <p className="text-sixty font-dmSans font-normal text-[9.28px] leading-[12.08px] sm:text-[13.5px]  sm:leading-[15px] lg:text-[18px] lg:leading-[23.44px] tracking-[0px]">
                {" "}
                - {dat.des}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DollarInner
