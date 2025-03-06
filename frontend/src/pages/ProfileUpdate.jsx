import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { updateUserProfile } from "../components/redux/user/userSlice";
import { useLocation } from "react-router-dom";
const ProfileUpdate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
   const [formData, setFormData] = useState({});
   const [error, setError] = useState(null);
  const currentUser = useSelector((state) => state.user.currentUser);
 const location = useLocation(); // Import useLocation from react-router-dom
 const [sourceRoute, setSourceRoute] = useState(null);

 // Add this useEffect to detect the source route when component mounts
 useEffect(() => {
   // Check for source information in URL search params
   const queryParams = new URLSearchParams(location.search);
   const source = queryParams.get("source");

   // Or check state if it was passed via navigate state prop
   const sourceFromState = location.state?.from;

   setSourceRoute(source || sourceFromState || null);
 }, [location]);
  // New useEffect to auto-hide error message after 30 seconds
  useEffect(() => {
    let timeoutId;
    if (error) {
      timeoutId = setTimeout(() => {
        setError(null);
      }, 30000); // 30 seconds
    }

    // Cleanup function to clear timeout if component unmounts or error changes
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [error]);

  useEffect(() => {
    const walletAddress = currentUser?.user?.walletAddress;

    const fetchUserByWallet = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/auth/getUsersByWalletAddress`,
          {
            params: { walletAddress },
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data?.users?.length > 0) {
          const user = response.data.users[0];
          setUserData(user);
          setFormData(user);
        } else {
          console.warn("No user data found.");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to fetch user data");
      }
    };

    if (walletAddress) {
      fetchUserByWallet();
    }
  }, [currentUser]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

   const handleUpdate = async () => {
     // Validate all required fields
     const requiredFields = [
       "name",
       "role",
       "email",
       "twitterId",
       "github",
       "website",
       "telegram",
     ];
     const missingFields = requiredFields.filter(
       (field) => !formData[field] || formData[field].trim() === ""
     );

     if (missingFields.length > 0) {
       setError(`Please fill in all fields: ${missingFields.join(", ")}`);
       return;
     }

     try {
       // Get the token from local storage or Redux state
       const token = currentUser?.token;

       if (!token) {
         setError("No authentication token found. Please log in.");
         return;
       }

       const response = await axios.put(
         "http://localhost:5000/api/auth/user/update",
         {
           name: formData.name,
           role: formData.role,
           twitterId: formData.twitterId,
           github: formData.github,
           website: formData.website,
           telegram: formData.telegram,
         },
         {
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
           },
         }
       );

       // If API call is successful, update Redux store manually with the form data
       if (response.status === 200) {
         console.log("Current User Before Update:", currentUser);
         console.log("Form Data:", formData);

         // Dispatch action to update Redux store
        dispatch(updateUserProfile(response.data.user));

         // Optional: Update local state or show success message
         setError(null);
          if (sourceRoute === "/sbt-mint") {
            navigate("/predefined-help-request", { replace: true });
          } else {
            navigate("/profile", { replace: true });
          }
       }
     } catch (error) {
       console.error("Error updating user:", error);
       setError(error.response?.data?.message || "Failed to update profile");
     }
   };
  const placeholders = {
    name: "Enter your name...",
    role: "Enter your role...",
    email: "Enter your email...",
    walletAddress: "Your wallet address (cannot be edited)",
    twitterId: "Enter your Twitter ID...",
    github: "Enter your GitHub profile...",
    website: "Enter your website...",
    telegram: "Enter your Telegram ID...",
  };

  return (
    <div className="px-4 sm:px-16 lg:px-20 pb-20">
      <div className="flex flex-col gap-6 md:gap-10">
        <div className="flex flex-col gap-4">
          <p className="font-dmSans font-medium italic text-xl lg:text-2xl underline text-primary">
            Personal Info
          </p>
          <div className="flex flex-col gap-4">
            {["name", "role", "email", "walletAddress"].map((field) => (
              <div key={field} className="flex gap-6 items-center">
                <p className="text-primary min-w-[120px]">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </p>
                <input
                  type="text"
                  placeholder={placeholders[field]}
                  value={formData[field] || ""}
                  onChange={(e) => {
                    if (field !== "walletAddress") {
                      handleInputChange(field, e.target.value);
                    }
                  }}
                  disabled={field === "walletAddress"}
                  className={`w-[332px] h-[36.77px] gap-[8.34px] rounded-[8.34px] border-[0.58px] px-[13.34px] py-[10px] font-normal placeholder:text-[11.96px] placeholder:leading-[15.57px] lg:w-[609px] lg:h-[55px] lg:gap-[12.55px] lg:rounded-[12.55px] lg:border-[0.88px] border-white/20 lg:px-[20.07px] lg:py-[15.05px] placeholder:text-white/40 placeholder:font-normal placeholder:tracking-[0] lg:placeholder:text-[18px] lg:placeholder:leading-[23.44px] text-[11.96px] lg:text-[18px] leading-[24.74px] font-dmSans tracking-[-0.76px] text-primary 
                    ${field === "walletAddress" ? "cursor-default" : ""}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-dmSans font-medium italic text-xl lg:text-2xl underline text-primary">
            Social Links
          </p>
          {["twitterId", "github", "website", "telegram"].map((link) => (
            <div key={link} className="flex gap-6 items-center">
              <p className="text-primary min-w-[120px]">
                {link.charAt(0).toUpperCase() + link.slice(1)}
              </p>
              <input
                type="text"
                placeholder={placeholders[link]}
                value={formData[link] || ""}
                onChange={(e) => handleInputChange(link, e.target.value)}
                className="w-[332px] h-[36.77px] gap-[8.34px] rounded-[8.34px] border-[0.58px] px-[13.34px] py-[10px] font-normal placeholder:text-[11.96px] placeholder:leading-[15.57px] lg:w-[609px] lg:h-[55px] lg:gap-[12.55px] lg:rounded-[12.55px] lg:border-[0.88px] border-white/20 lg:px-[20.07px] lg:py-[15.05px] placeholder:text-white/40 placeholder:font-normal placeholder:tracking-[0] lg:placeholder:text-[18px] lg:placeholder:leading-[23.44px] text-[11.96px] lg:text-[18px] leading-[24.74px] font-dmSans tracking-[-0.76px] text-primary"
              />
            </div>
          ))}
        </div>
        {error && (
          <div className="text-red-500 w-fit bg-red-100 p-3 rounded-lg">{error}</div>
        )}
        <button
          onClick={handleUpdate}
          className="font-dmSans cursor-pointer w-[69.93px] h-[25.56px] sm:rounded-[5.86px] sm:p-[5.86px] sm:text-[10.55px] lg:h-[43px] rounded-[5.78px] border-[0.58px] 
  px-[5.78px] py-[5.78px] text-[10.4px] leading-[13.54px] lg:w-[121px] text-center font-medium lg:text-[18px] lg:leading-[23.44px] tracking-[0%]  bg-white text-black lg:rounded-[10px]  lg:p-[10px]"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default ProfileUpdate;
