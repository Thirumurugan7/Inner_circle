import React,{useState} from 'react'
import FormInput from '../uicomponents/FormInput';
import google from '../assets/images/google.svg'
import Logo from '../uicomponents/Logo'

const Signup = () => {
    const [formData, setFormData] = useState({
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    });

    const handleChange = (field) => (e) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };
  return (
    <div className="px-[90px] pt-[47px] pb-28  pageborder bg-none sm:bg-contain lg:bg-cover xl:mx-12  ">
      <div className=" flex items-center w-full sm:w-fit justify-center mb-[47px] sm:items-start sm:justify-items-start">
        <Logo />
      </div>

      <div className="flex flex-col items-center justify-center pt-2 h-full">
        <div className="flex flex-col gap-[8.34px] sm:gap-[12px] mb-[15.9px] sm:mb-8">
          <h1 className="font-dmSans font-bold text-[29.19px] leading-[32.11px] tracking-[-1.17px] sm:text-[42px] sm:leading-[46.2px] sm:tracking-[-4%] text-center text-primary ">
            Sign up
          </h1>
          <p className="font-dmSans font-normal w-[364px] text-[12.51px] leading-[18.77px] sm:text-[18px] sm:leading-[27px] tracking-[0] text-secondry text-center sm:w-full">
            Please register to continue to your account.
          </p>
        </div>
        <form>
          <FormInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
          />
          <FormInput
            label="Username"
            value={formData.username}
            onChange={handleChange("username")}
          />
          <FormInput
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange("password")}
          />
          <FormInput
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange("confirmPassword")}
          />

          <button
            className="w-[277.35px] h-[37.24px] gap-[5.56px] rounded-[6.95px] border-[0.7px] 
                px-[5.56px] py-[11.12px] text-[12.51px] leading-[15.01px] tracking-[-0.125px] font-dmSans font-semibold sm:text-[18px] sm:leading-[21.6px] sm:tracking-[-0.01em] text-black bg-primary sm:w-[399px] sm:h-[54px] sm:p-[16px_8px] sm:gap-[8px] sm:rounded-[10px] cursor-pointer"
          >
            Register
          </button>
        </form>
        <div className="flex items-center justify-between w-[277.35px] sm:w-[399px] py-[13.9px] sm:py-5">
          <div className="w-[125.72px] sm:w-[181px] border-[.5px] border-secondry h-0 mt-0.5"></div>
          <p className="font-[500] text-[11.12px] leading-[16.68px] sm:text-[16px] sm:leading-[24px] tracking-[0] text-four text-bri">
            or
          </p>
          <div className="w-[125.72px] sm:w-[181px] border-[.5px] border-secondry h-0 mt-0.5"></div>
        </div>
        <div className="flex flex-col">
          <button
            className="sm:block hidden w-[277.35px] h-[37.24px] gap-[5.56px] rounded-[6.95px] border-[0.7px] 
                px-[5.56px] py-[11.12px] text-[12.51px] leading-[15.01px] tracking-[-0.125px] font-dmSans font-semibold sm:text-[18px] sm:leading-[21.6px] sm:tracking-[-0.01em] text-black bg-primary sm:w-[399px] sm:h-[54px] sm:p-[16px_8px] sm:gap-[8px] sm:rounded-[10px] cursor-pointer mb-5"
          >
            Sign in with Web3auth
          </button>
          <button
            className="flex items-center justify-center w-[277.35px] h-[37.24px] gap-[5.56px] rounded-[6.95px] border-[0.7px] 
                px-[5.56px] py-[11.12px] text-[12.51px] leading-[15.01px] tracking-[-0.125px] font-dmSans font-semibold sm:text-[18px] sm:leading-[21.6px] sm:tracking-[-0.01em] text-black bg-primary sm:w-[399px] sm:h-[54px] sm:p-[16px_8px] sm:gap-[8px] sm:rounded-[10px] cursor-pointer"
          >
            Sign in with Google{" "}
            <img
              src={google}
              alt=""
              className="h-[14.06px] w-[14.06px] sm:h-fit sm:w-fit"
            />
          </button>
        </div>
        <div className="font-dmSans font-normal text-[12.51px] leading-[18.77px] sm:text-[18px] sm:leading-[27px] tracking-[0] text-secondry text-center mt-[15.9px] sm:py-5">
          Already have an account?{" "}
          <span className="font-semibold text-primary underline">Login</span>
        </div>
      </div>
    </div>
  );
}

export default Signup
