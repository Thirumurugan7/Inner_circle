import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import chevronleft from "../assets/images/chevronleft.svg";
import chevrondown from "../assets/images/chevrondown.svg";
import blackdownchevron from "../assets/images/blackdownchevron.svg";
import mark from "../assets/images/mark.svg";
import pluscircle from "../assets/images/pluscircle.svg";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const AskForHelp = () => {
  const [description, setDescription] = useState("");
  const [selectedUrgency, setSelectedUrgency] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Select category");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const currentUser = useSelector((state) => state.user.currentUser);
  const Category = [
    "Networking",
    "Public Speaking",
    "Feedback",
    "Collaboration",
    "Mentorship",
    "Job Referrals",
    "Career",
    "Learning",
    "Others",
  ];
  const urgencyLevels = ["Low", "Medium", "High"];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    // Don't process if already submitted or loading
    if (loading || isSubmitted) return;

    const newErrors = {
      description: !description,
      category: selectedCategory === "Select category",
      urgency: !selectedUrgency,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setMessage({ type: "error", text: "Please fill all required fields." });
      return;
    }

    setLoading(true);
    setMessage(null);
    const token = currentUser.token;

    try {
      const userId = currentUser.user._id;
      const telegram = currentUser.user.telegram;

      const response = await axios.post(
        "http://localhost:5001/api/helprequest/",
        {
          userId,
          telegram,
          description,
          urgency: selectedUrgency,
          category: selectedCategory,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage({ type: "success", text: response.data.message });
      setIsSubmitted(true);
      navigate("/regular-request-posted");
      setDescription("");
      setSelectedCategory("Select category");
      setSelectedUrgency(null);
    } catch (error) {
      setMessage({ type: "error", text: "Try Again" });
      setIsSubmitted(false); // Reset submitted state on error
    } finally {
      setLoading(false);
    }
  };

  // Auto-hide message after a few seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000); // Hides the message after 3 seconds

      return () => clearTimeout(timer); // Cleanup on unmount or new message
    }
  }, [message]);

  // Reset the submitted state if any field changes
  useEffect(() => {
    if (isSubmitted) {
      setIsSubmitted(false);
    }
  }, [description, selectedCategory, selectedUrgency]);

  return (
    <div className="flex flex-col justify-center items-center w-full px-[23px] sm:px-[60px] lg:px-[80px] h-full min-h-screen">
      <div className="sm:w-fit w-[335px]   ">
        <div>
          <Link to="/dashboard">
            <p className="font-dmSans font-medium text-[12px] leading-[12px] lg:text-[16px] lg:leading-[16px] text-primary flex items-center cursor-pointer gap-1 lg:gap-2">
              <img
                src={chevronleft}
                alt=""
                className="h-[15.26px] w-[15.26px] lg:h-[24px] lg:w-[24px]"
              />
              Go back to dashboard
            </p>
          </Link>
          <h1 className="thunder-medium pt-[34px] font-medium text-[28.28px] leading-[26px]  lg:text-[42px] lg:leading-[38.64px] text-left lg:text-center text-primary flex items-center justify-center gap-3">
            <img
              src={mark}
              alt=""
              className="h-[29.63px] w-[29.63px]  lg:h-[44px] lg:w-[44px]"
            />
            <span className="pt-[2px]">
              Need Help? Let the Community Support You!
            </span>
          </h1>
        </div>

        <div className="gap-[13.29px] lg:gap-[20px] flex flex-col py-[25px] lg:py-[40px]">
          <div className="gap-[7.5px] lg:gap-[11.29px] flex flex-col">
            <p className="font-dmSans font-medium text-[11.96px] leading-[17.94px] lg:text-[18px] lg:leading-[27px] tracking-[0] text-primary">
              What do you need help with? *
            </p>
            <input
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: false }));
                  setMessage(null);
                }
              }}
              placeholder="Enter your help request..."
              className="w-[332px] h-[36.77px] gap-[8.34px] rounded-[8.34px] border-[0.58px] px-[13.34px] py-[10px]  font-normal placeholder:text-[11.96px] placeholder:leading-[15.57px] lg:w-[609px] lg:h-[55px] lg:gap-[12.55px] lg:rounded-[12.55px] lg:border-[0.88px] border-white/20 lg:px-[20.07px] lg:py-[15.05px] placeholder:text-white/40 placeholder:font-normal placeholder:tracking-[0] lg:placeholder:text-[18px] lg:placeholder:leading-[23.44px] text-[11.96px] lg:text-[18px] leading-[24.74px] font-dmSans tracking-[-0.76px] text-primary"
            />
            {errors.description && (
              <p className="text-sixty font-dmSans  text-[12px]">
                Description is required.
              </p>
            )}
          </div>
          {/* Category Selection */}
          <div
            className="gap-[7.5px] lg:gap-[11.29px] flex flex-col relative"
            ref={dropdownRef}
          >
            <p className="font-dmSans font-medium text-[11.96px] leading-[17.94px] lg:text-[18px] lg:leading-[27px] text-primary">
              Category *
            </p>
            {/* Dropdown Button */}
            <div
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                if (errors.category) {
                  setErrors((prev) => ({ ...prev, category: false }));
                  setMessage(null);
                }
              }}
              className={`w-fit h-[36.54px] gap-[3.32px] lg:h-[55px] rounded-[6.64px] border-[0.47px] px-[14.62px] py-[7.97px] lg:rounded-[12.55px] lg:border-[0.88px] border-white/20 flex items-center lg:w-fit lg:py-[12px] lg:px-[22px] font-normal cursor-pointer text-[10.63px] lg:text-[16px] leading-[23.44px] font-dmSans tracking-[0] ${
                selectedCategory !== "Select category"
                  ? "bg-white text-black"
                  : "text-fourty"
              }`}
            >
              {selectedCategory}{" "}
              <img
                src={
                  selectedCategory !== "Select category"
                    ? blackdownchevron
                    : chevrondown
                }
                alt="chevron"
                className={`ml-2 transition-transform duration-200 ease-in-out ${
                  selectedCategory !== "Select category"
                    ? "w-[10px] h-[4.75px] lg:w-fit lg:h-fit"
                    : "h-[15px] w-[15px] lg:w-fit lg:h-fit"
                } `}
                style={{
                  transform: dropdownOpen ? "rotate(180deg) " : "rotate(0deg)",
                }}
              />
            </div>
            {errors.category && (
              <p className="text-sixty font-dmSans  text-[12px]">
                Category is required.
              </p>
            )}
            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute top-[100%] -mt-1.5 w-[130px] lg:w-[173px] max-h-[360px] overflow-auto rounded-[10px] border border-black px-[10px] bg-white shadow-lg z-10 transition-all duration-200 ease-in-out opacity-100 scale-100">
                {Category.map((cat) => (
                  <div
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setDropdownOpen(false);
                    }}
                    className="text-center font-dmSans font- text-[10.63px]  lg:text-[15px] leading-[19.53px] border-b-[0.6px] border-[#00000033] py-[5.7px] lg:py-[9.7px] cursor-pointer hover:bg-gray-200"
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Urgency Level */}
          <div className="gap-[7.5px] lg:gap-[11.29px] flex flex-col">
            <p className="font-dmSans font-medium text-[11.96px] leading-[17.94px] lg:text-[18px] lg:leading-[27px] text-primary">
              Urgency Level *
            </p>
            <div className="flex gap-[11px]">
              {urgencyLevels.map((level) => (
                <p
                  key={level}
                  onClick={() => {
                    setSelectedUrgency(level);
                    if (errors.urgency) {
                      setErrors((prev) => ({ ...prev, urgency: false }));
                      setMessage(null);
                    }
                  }}
                  className={`flex items-center justify-center w-[68.46px] h-[34.23px] gap-[2.85px] rounded-[5.71px] border-[0.66px] 
  px-[12.55px] py-[6.85px] font-dmSans font-normal text-[10.63px] leading-[13.84px]  lg:w-[103.04px] lg:h-[51.52px] lg:rounded-[8.59px] lg:border-[0.88px] border-white/20 cursor-pointer lg:text-[16px]  tracking-[0] ${
    selectedUrgency === level ? "bg-white text-black" : "text-fourty"
  }`}
                >
                  {level}
                </p>
              ))}
            </div>
            {errors.urgency && (
              <p className="text-sixty font-dmSans  text-[12px]">
                Urgency level is required.
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || isSubmitted}
          className={`text-black w-[121.68px] h-[29.9px] gap-[5.16px] rounded-[5.16px] p-[6.64px] 
  font-dmSans font-medium text-[10.63px] leading-[16.22px] lg:text-[16px] lg:leading-[24.41px] bg-primary lg:w-[182.17px] lg:h-[45px] lg:rounded-[7.76px] lg:p-[10px] flex items-center lg:gap-1 justify-center ${
    loading || isSubmitted ? "opacity-50 " : "cursor-pointer"
  }`}
        >
          <img
            src={pluscircle}
            alt=""
            className="h-[12.23px] w-[12.23px] lg:h-[18.41px] lg:w-[18.41px]"
          />
          {loading ? "Posting..." : "Post Your Request"}
        </button>
      </div>
    </div>
  );
};

export default AskForHelp;
