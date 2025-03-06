import React from 'react'
import tick from '../assets/images/tick.svg'

const SBTInfoCard = () => {
    const Infos = [
      "Access to Inner Circle private hub",
      "Participation in high-value meetups",
      "Unlock exclusive rewards and recognition",
      "Ability to contribute, collaborate, and earn points",
    ];
  return (
    <div className="mintdetbg w-[263.07px] h-[360.23px] sm:w-[233.18px] sm:h-[319.31px] lg:w-[398px] lg:h-[545px]  rotate-[5.05deg] text-black flex flex-col justify-between rounded-[20px] shadow-[0px_0px_218px_13px_#FFFFFF66]">
      <div className="text-black p-[23.31px] sm:p-[32.84px] lg:p-[34.96px] flex flex-col items-center  justify-center gap-[6.6px] sm:gap-[5.86px] lg:gap-[10px]">
        <h1 className="font-bold text-[35.69px] leading-[32.84px] sm:text-[31.64px] sm:leading-[29.11px] lg:text-[54px] lg:leading-[49.68px] tracking-[0%] thunder-bold text-center">
          Why This Matters?
        </h1>
        <p className="font-normal text-[11.9px] leading-[15.49px] tracking-[-0.04em] sm:text-[10.55px] sm:leading-[13.73px] sm:tracking-[-0.42px] lg:text-[18px] lg:leading-[23.44px] lg:tracking-[-4%] text-center font-dmSans w-[200.77px] sm:w-[178.11px] lg:w-[304px]">
          This SBT is your proof of trust, reputation, and contribution within
          the Inner Circle.
        </p>
      </div>

      <div className="text-[13.22px] leading-[17.21px] tracking-[-0.04em] font-normal sm:text-[10.55px] sm:leading-[13.73px] sm:tracking-[-0.42px]  lg:text-[20px] lg:leading-[26.04px] lg:tracking-[-0.8px] text-black p-[25px] flex flex-col gap-[11.89px] sm:gap-[10.55px] lg:gap-[18px]">
        {Infos.map((Info) => (
          <div className="flex gap-[10px] items-start">
            <img
              src={tick}
              alt=""
              className="h-[10.57px] w-[10.57px] sm:w-[9.37px] sm:h-[9.37px] lg:h-[16px] lg:w-[16px]"
            />
            <p className="-mt-0.5 sm:-mt-1">{Info}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SBTInfoCard
