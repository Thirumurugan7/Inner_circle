import React, { useState } from "react";
import { Check } from "lucide-react";
import pluscircle from "../assets/images/pluscircle.svg";
import selected from '../assets/images/selected.svg'
import { Link, useNavigate} from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios"; 
import { initialRequests } from "../constant";

const PredefinedRequest = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  
  const currentUser = useSelector((state) => state.user.currentUser);
  
  const [selectedRequests, setSelectedRequests] = useState(
    initialRequests.map((req) => req.id)
  ); 

  const toggleRequest = (id) => {
    setSelectedRequests((prev) =>
      prev.includes(id) ? prev.filter((reqId) => reqId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (req) => {
    if (!req.title || !req.category || !req.urgency) {
      setMessage({ type: "error", text: "Please fill all required fields." });
      return;
    }

    setLoading(true);
    setMessage(null);
    const token = currentUser.token;

    try {
      const userId = currentUser.user._id;
      const telegram = currentUser.user.telegram; // If available

      const response = await axios.post(
        "http://localhost:5001/api/helprequest/",
        {
          userId,
          telegram,
          description: req.title,
          urgency: req.urgency,
          category: req.category,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Include JWT token
        }
      );

      setMessage({ type: "success", text: response.data.message });
      navigate("/request-posted");
      console.log("Success:", response.data);
    
    } catch (error) {
      console.log("Error Data:", error.response?.data);
      setMessage({ type: "error", text: "Try Again" });
      setLoading(false); // Make sure to reset loading on error
    }
  };

  const handlePostRequests = async () => {
    if (selectedRequests.length === 0) {
      setMessage({ type: "error", text: "Please choose at least one request." });

      // Hide the error message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);

      return;
    }

    // Set loading to true at the beginning to disable the button
    setLoading(true);

    try {
      for (const reqId of selectedRequests) {
        const request = initialRequests.find((req) => req.id === reqId);
        if (request) {
          await handleSubmit(request); // Ensure each request is awaited properly
        }
      }
      // Note: The navigation happens in handleSubmit after successful submission
    } catch (error) {
      console.error("Error posting requests:", error);
      setLoading(false); // Reset loading state on error
    }
  };

  return (
    <div className="px-4 sm:px-12">
      <div className="flex flex-col items-center justify-center py-[116px] gap-[20px] sm:gap-[60px] ">
        <div>
          <h1 className="thunder-bold font-bold text-[33.84px] leading-[31.13px] tracking-[-0.33px] sm:text-[50px] sm:leading-[43px] lg:text-[68px] lg:leading-[62.56px] sm:tracking-[0.68px] text-center text-primary">
            Kickstart Your Journey – Ask for Help!
          </h1>
          <p className="mx-auto font-dmSans  font-normal text-[10.95px] leading-[14.26px] tracking-[-0.04em] sm:text-[17px] sm:leading-[20px] lg:text-[22px] lg:leading-[28.64px] sm:tracking-[-0.88px] text-center text-sixty pt-[4.98px] sm:pt-[10px] max-w-[391.16px] sm:max-w-[500px] md:max-w-[786px]">
            Start engaging with the community by posting a request. We've
            pre-selected some common help requests for you – feel free to edit,
            unselect, or post your own!
          </p>
        </div>

        {/* Requests List */}
        <div className="flex flex-col gap-3 sm:gap-5 justify-center items-center">
          {initialRequests.map((req) => {
            const isSelected = selectedRequests.includes(req.id);
            return (
              <div
                key={req.id}
                onClick={() => toggleRequest(req.id)}
                className={`flex items-center  `}
              >
                <span
                  className={`font-dmSans font-medium rounded-[3.86px] text-[7.96px] leading-[12.15px] tracking-[0px] sm:rounded-[6px] sm:px-[10px] sm:py-[12px] sm:text-[12px] lg:text-[18px] lg:leading-[23.44px] lg:tracking-[-0.54px]  cursor-pointer transition-all px-[8px] py-[4.98px] lg:py-[15px] lg:px-[20px] lg:rounded-[10px] mr-[10px] sm:mr-[20px] ${
                    isSelected
                      ? "bg-white text-black"
                      : "border-[1px] border-white text-white"
                  }`}
                >
                  {req.no}. {req.title}
                </span>
                {isSelected && (
                  <img
                    src={selected}
                    alt=""
                    className=" h-[12px] w-[12px] sm:h-[20px] sm:w-[20px]"
                  />
                )}
              </div>
            );
          })}
        </div>
        {message?.type === "error" && (
          <p className="text-sixty font-dmSans  text-[12px]">{message.text}</p>
        )}
        {/* Buttons */}
        <div className="flex gap-[20px] items-center justify-center ">
          <button
            onClick={handlePostRequests}
            disabled={loading}
            className={`text-black cursor-pointer bg-primary w-[116.45px] h-[24.88px] gap-[3.86px] rounded-[3.86px] p-[4.98px] font-dmSans font-medium text-[7.96px] leading-[12.15px] sm:text-[12px] lg:text-[16px] sm:leading-[24.41px] tracking-[0] sm:w-fit sm:h-fit sm:px-[9px] sm:py-[7px] lg:w-[234px] lg:h-[50px] lg:gap-[7.76px] lg:rounded-[7.76px] lg:p-[10px] flex items-center justify-center ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <img
              src={pluscircle}
              alt=""
              className="h-[12.23px] w-[12.23px] sm:h-[15px] sm:w-[15px] lg:h-fit lg:w-fit"
            />
            {loading ? "Posting..." : "Post Selected Requests"}
          </button>
          <Link to="/ask-for-help">
            <button 
              className="w-[116.45px] h-[24.88px] gap-[3.86px] rounded-[3.86px] border-[0.5px] p-[4.98px] font-dmSans font-medium text-[7.96px] leading-[12.15px] tracking-[0px] sm:text-[12px] lg:text-[16px] sm:leading-[24.41px] cursor-pointer text-primary sm:gap-[7.76px] sm:rounded-[7.76px] sm:border-[1px] border-white sm:w-fit sm:h-fit sm:px-[9px] sm:py-[7px] lg:w-[234px] lg:h-[50px] lg:gap-[7.76px] lg:rounded-[7.76px] lg:p-[10px]"
              disabled={loading}
            >
              Post a Custom Request →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PredefinedRequest;