import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { RiEyeOffLine } from "react-icons/ri";
import { RiEyeLine } from "react-icons/ri";

const FormInput = ({ label, type = "text", value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";
  const effectiveType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="relative  sm:w-[399px] mb-[13.9px] sm:mb-5">
      <input
        type={effectiveType}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(value ? true : false)}
        className={`w-[277.35px] h-[41.24px] sm:w-[399px] sm:h-[59px]  rounded-[6.95px] sm:rounded-[10px] 
          ${
            isFocused || value
              ? "border-white border-[1.4px] sm:border-[1.5px] "
              : "border-[#D9D9D9]  border-[0.7px] sm:border-[1px] "
          }    
          p-[11.12px] sm:p-[16px] leading-[18.77px]  sm:leading-[27px] tracking-[0] text-[12.51px] sm:text-[18px] font-normal 
          focus:border-white focus:border-[1.5px] focus:text-white text-secondry
          [&:-webkit-autofill]:bg-black
          [&:-webkit-autofill]:[-webkit-text-fill-color:var(--text-white)]
          [&:-webkit-autofill]:[transition:background-color_10000s_ease-in-out_0s]`}
        placeholder=" "
      />
      <label
        className={`absolute left-2 sm:left-4 transition-all duration-200 ease-in-out 
          font-dmSans  leading-[18.77px]  sm:leading-[27px] tracking-[0]
          ${
            isFocused || value
              ? "-top-2 sm:-top-3 bg-black px-1 text-[9.73px] sm:text-[14px] font-medium text-white"
              : "top-3 sm:top-4 text-[12.51px] sm:text-[18px] font-normal text-secondry"
          }
          pointer-events-none`}
      >
        {label}
      </label>

      {isPasswordField && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute right-3 top-1/2 -translate-y-1/2 
            transition-colors duration-200
            ${
              isFocused || value
                ? "text-white hover:text-gray-300"
                : "text-secondry hover:text-gray-300"
            }
            focus:outline-none focus:text-secondry`}
        >
          {showPassword ? (
            <RiEyeLine className="stroke-current " />
          ) : (
            <RiEyeOffLine className="stroke-current" />
          )}
        </button>
      )}
    </div>
  );
};

export default FormInput;
