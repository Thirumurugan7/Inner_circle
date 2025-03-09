import React from 'react'
import { useSelector } from 'react-redux';
const SBTCard = () => {
   const currentUser = useSelector((state) => state.user.currentUser);
  return (
    <div className="mintdetbg w-[263.07px] h-[360.23px] sm:w-[233.18px] sm:h-[319.31px] lg:w-[398px] lg:h-[545px]  -rotate-[5.05deg] text-black flex flex-col justify-between shadow-[0px_0px_218px_13px_#FFFFFF66]  rounded-[20px]">
      <div className="p-[23.31px] sm:p-[32.84px] lg:p-[34.96px]">
        <h1 className="font-bold text-[35.69px] leading-[32.84px] sm:text-[31.64px] sm:leading-[29.11px] lg:text-[54px] lg:leading-[49.68px] tracking-[0%] thunder-bold text-center">
          Inner Circle SBT
        </h1>
        <p className="font-normal text-[11.9px] leading-[15.49px] tracking-[-0.04em] sm:text-[10.55px] sm:leading-[13.73px] sm:tracking-[-0.42px] lg:text-[18px] lg:leading-[23.44px] lg:tracking-[-4%] text-center font-dmSans">
          Your Badge of Trust & Identity
        </p>
      </div>
      <div className="font-dmSans p-[25px]">
        <h3 className="font-bold text-[25.12px] leading-[32.7px] tracking-[-0.04em] sm:text-[22.26px] sm:leading-[28.99px] sm:tracking-[-0.89px] lg:text-[38px] lg:leading-[49.48px] lg:tracking-[-0.8px]">
          {currentUser?.user?.name}
        </h3>
        <div className=" text-[13.22px] leading-[17.21px] tracking-[-0.04em] font-normal sm:text-[11.72px] sm:leading-[15.26px] sm:tracking-[-0.47px] lg:text-[20px] lg:leading-[26.04px] lg:tracking-[-0.8px]">
          <p>Verified Member</p>
          <p>
            #IC-
            {currentUser?.user?.sbtId && currentUser?.user?.sbtId !== "0"
              ? currentUser.user.sbtId
              : "[Unique NFT Identifier]"}
          </p>
          <p>[Base]</p>
        </div>
      </div>
    </div>
  );
}

export default SBTCard
