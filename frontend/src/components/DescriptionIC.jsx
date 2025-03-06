import React from 'react'
import desIc from '../assets/images/desIc.svg'

const DescriptionIC = () => {
  return (
    <div className="  w-[328px] sm:w-[400px] md:w-[483.94px] lg:w-[700px] xl:w-[826px] flex flex-col gap-[15px] sm:gap-[20px] lg:gap-[35px] justify-center mx-auto relative">
      <h1 className="text-primary thunder-bold font-bold text-[24.62px] sm:text-[30px] sm:leading-[40px] md:text-[36.33px] md:leading-[33.42px] lg:text-[50px] lg:leading-[45px]  leading-[22.65px] xl:text-[62px] xl:leading-[57.04px] tracking-[0em]">
        A Circle for Those Who Dare to Be Different
      </h1>
      <img
        src={desIc}
        alt=""
        className="absolute -top-3 lg:-top-5 -right-1 h-[10px] w-[10px] md:w-[11.72px] md:h-[11.72px] lg:h-[20px] lg:w-[24px]"
      />
      <div className="text-thirty font-dmSans font-normal text-[10.32px] leading-[16.54px] tracking-[-0.04em] sm:text-[14px] sm:leading-[18px] md:text-[18.75px] md:leading-[24.41px] md:tracking-[-0.04em] lg:text-[23px] lg:leading-[30px] xl:text-[26px] xl:leading-[33.85px] sm:tracking-[-0.04em] flex flex-col gap-[15px] sm:gap-[20px] lg:gap-[35px]">
        <p>
          <span className="text-primary">
            Inner Circle is a space where ambition meets action.
          </span>{" "}
          A network shaped by trust, built on contribution, and bound by a
          shared drive to transform.
        </p>
        <p>
          Here,{" "}
          <span className="text-primary">
            belonging isn’t given—it’s earned.
          </span>{" "}
          It’s about proving your worth, finding those who push you higher, and
          knowing your place is secured through{" "}
          <span className="text-primary">
            growth, collaboration, and purpose
          </span>
        </p>
        <p>
          Inner Circle isn’t a place for the ordinary.{" "}
          <span className="text-primary">
            It’s a dynamic community of innovators, creators, and pathfinders
          </span>{" "}
          who challenge the status quo and build the future.
        </p>
        <p>
          <span className="text-primary">
            This ismore than a network—it’s a bond.
          </span>{" "}
          A decentralized, evolving collective where every step you take
          strengthens the Circle, and{" "}
          <span className="text-primary">every connection creates impact.</span>
        </p>
        <p>
          Because in Inner Circle, belonging isn’t just a word.{" "}
          <span className="text-primary">
            Belonging is trust. Belonging is action. Inner Circle is the change.
          </span>
        </p>
      </div>
    </div>
  );
}

export default DescriptionIC

