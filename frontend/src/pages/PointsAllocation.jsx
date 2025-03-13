import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import mark from "../assets/images/Mark.svg";
import search from "../assets/images/search.svg";
import pointsarrow from "../assets/images/pointsarrow.svg";
import pointsarrowwhite from "../assets/images/pointsarrowwhite.svg";
import chevrondown from "../assets/images/chevrondown.svg";
import blackdownchevron from "../assets/images/smallvector.svg";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import { updateUserProfile } from "../components/redux/user/userSlice";
const PointsAllocationCard = () => {
  const [users, setUsers] = useState([]);
  const [allocationSuccess, setAllocationSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [expandedMember, setExpandedMember] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Select category");
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [feedback, setFeedback] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAllocating, setIsAllocating] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate hook
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

  useEffect(() => {
    const walletAddress = currentUser?.user?.walletAddress;

    const fetchUserByWallet = async () => {
      try {
        const response = await axios.get(
          `https://inner-circle-nine.vercel.app/api/auth/getUsersByWalletAddress`,
          {
            params: { walletAddress },
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log("Fetched Data:", response.data); // Log full response

        // Check if users array is not empty
        if (response.data?.users?.length > 0) {
          dispatch(updateUserProfile(response.data.users[0]));
        } else {
          console.warn("No user data found.");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (walletAddress) {
      fetchUserByWallet();
    }
  }, [currentUser]);

  // Add another useEffect to log when userData changes

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter((user) => {
    if (!currentUser || user.walletAddress === currentUser.user.walletAddress) {
      return false; // Exclude currentUser
    }

    const name = user.name ? user.name.toLowerCase() : "";
    const twitterId = user.twitterId ? String(user.twitterId) : "";
    const search = String(searchTerm).toLowerCase();

    return name.includes(search) || twitterId.includes(search);
  });

  const handleExpand = (index) => {
    if (expandedMember !== index) {
      setSelectedCategory("Select category"); // Reset category on switching
      setDropdownOpen(false); // Close dropdown when switching
      setSelectedPoint(null);
      setFeedback("");
      setAllocationSuccess(false);
      setButtonDisabled(false); // Reset button when switching to a new user
    }
    setExpandedMember(expandedMember === index ? null : index);
  };

  // Auto-close expanded card after successful allocation
  useEffect(() => {
    let timer;
    if (allocationSuccess) {
      timer = setTimeout(() => {
        setExpandedMember(null);
        setAllocationSuccess(false);
        setSelectedCategory("Select category");
        setSelectedPoint(null);
        setFeedback("");
        setButtonDisabled(false); // Re-enable button when form resets
      }, 3000); // Close after 3 seconds
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [allocationSuccess]);

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

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Determine if we're in mobile view
  const isMobile = windowWidth < 768;

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await axios.get(
          "https://inner-circle-nine.vercel.app/api/auth/users"
        );
        if (response.data.success) {
          setUsers(response.data.users);
          console.log(response.data.users);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError("Error fetching users: " + error.message);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchUsers();
  }, []);

 const allocatePoints = async (user) => {
   // Check if user has required fields filled
   if (
     !selectedPoint ||
     selectedCategory === "Select category" ||
     feedback === ""
   ) {
     setErrorMessage("Please fill all the fields.");
     setTimeout(() => setErrorMessage(""), 3000); // Hide error after 3 seconds
     return;
   }

   // Check if the current user's SBT is active
   if (
     currentUser?.user?.isActive === false &&
     currentUser?.user?.sbtRevoked === true
   ) {
     // Navigate to reclaim-sbt page if SBT is revoked
     navigate("/reclaim-sbt");
     return;
   }

   setButtonDisabled(true); // Disable button when allocating starts
   setIsAllocating(true); // Start the allocation loading state
   const helpedForWallet = currentUser.user.walletAddress; // Wallet of the person receiving points
   const helpedByWallet = user.walletAddress; // Wallet of the user allocating points
   const points = selectedPoint;
   const category = selectedCategory;
   const token = currentUser.token;

   try {
     // Retrieve JWT token
     const response = await axios.post(
       "https://inner-circle-nine.vercel.app/api/action/allocatepoints",
       { helpedForWallet, helpedByWallet, points, feedback, category },
       { headers: { Authorization: `Bearer ${token}` } }
     );

     if (response.data.success) {
       setAllocationSuccess(true);
       // Button will remain disabled until the success message disappears
       // and the form resets via the useEffect above
     } else {
       alert("Error: " + response.data.message);
       setButtonDisabled(false); // Re-enable button on error
     }
   } catch (error) {
     if (error.response && error.response.data) {
       setErrorMessage(error.response.data.message);
     } else {
       setErrorMessage("An unexpected error occurred.");
       console.error("Error allocating points:", error);
     }
     setTimeout(() => setErrorMessage(""), 3000);
     setButtonDisabled(false); // Re-enable button on error
   } finally {
     setIsAllocating(false); // End the allocation loading state
     // We don't re-enable the button here as we want it to stay disabled
     // until the success message disappears
   }
 };

  // Reorganize users array so the expanded user comes first in mobile view
  const getOrderedUsers = () => {
    if (!isMobile || expandedMember === null) return filteredUsers;

    const result = [...filteredUsers];
    // Move expanded user to the front
    const expandedUser = result.splice(expandedMember, 1)[0];
    return [expandedUser, ...result];
  };

  // Get card style for each user
  const getCardStyle = (index, orderedUsers) => {
    // For mobile view and expanded card
    if (isMobile && index === 0 && expandedMember !== null) {
      return {
        gridColumn: "1 / -1", // Span all columns
        height: "auto",
        width: "100%",
        order: -1, // Ensure it's at the top
      };
    }

    // For non-expanded cards in mobile view, make more specific adjustments
    if (isMobile && (index !== 0 || expandedMember === null)) {
      return {
        height: "88px", // Fixed height for non-expanded cards
        marginBottom: "0px", // Reduce bottom margin
        width: "175.69px", // Maintain original width
        alignSelf: "start", // This will help cards stack properly
        gridRow: "auto", // Let the grid auto-place the items
        // Remove any flex properties that might be causing the issue
        display: "block",
      };
    }

    // For desktop view and expanded card
    if (!isMobile && orderedUsers[index] === filteredUsers[expandedMember]) {
      return {
        gridRow: "span 2", // Still 2 rows tall for desktop
        height: "auto",
      };
    }

    return {}; // Default style
  };

  const orderedUsers = getOrderedUsers();

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center w-full py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="">
      <div className="px-[9px] sm:px-[60px] lg:px-[80px] pb-[11rem] min-h-screen h-full">
        <div className="flex flex-col gap-[15px]">
          <div className="flex gap-[6.88px] sm:gap-[5.86px] lg:gap-[10px] items-center">
            <img
              src={mark}
              alt=""
              className="h-[32.52px] w-[32.52px] sm:w-[25.78px] sm:h-[25.78px] lg:h-[44px] lg:w-[44px]"
            />
            <p className="text-primary thunder-medium font-medium text-[28.9px] leading-[26.59px] sm:text-[24.61px] sm:leading-[22.64px]  lg:text-[42px] lg:leading-[38.64px] tracking-[0px]">
              Who Deserves Your Points, {currentUser?.user?.name}?
            </p>
          </div>
          <p className="font-dmSans font-medium text-[15.14px] leading-[19.71px] tracking-[-0.04em] sm:text-[12.89px] sm:leading-[16.78px] sm:tracking-[-0.52px]  lg:text-[22px] lg:leading-[28.64px] lg:tracking-[-0.04em] text-primary">
            Empower your community by allocating points!
          </p>
        </div>

        {/* Search Bar */}
        <div
          style={{
            background:
              "linear-gradient(0deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 99.17%)",
          }}
          className="w-[263px] h-[34.08px] gap-[6.09px] rounded-[2.43px] border-[0.61px] p-[9.74px] sm:w-[338.78px] sm:h-[29.05px] sm:gap-[5.19px]  sm:rounded-[2.08px] sm:border-[0.52px] sm:p-[8.3px] lg:w-[578.23px] lg:h-[49.59px] lg:gap-[8.85px] lg:rounded-[3.54px] lg:border-[0.89px] border-[#FFFFFF12] lg:p-[14.17px] flex items-center my-[20px] lg:my-[40px]"
        >
          <img
            src={search}
            alt=""
            className="w-[14.61px] h-[14.61px] sm:h-[12.45] sm:w-[12.45] lg:h-fit lg:w-fit"
          />
          <input
            type="text"
            placeholder="Find a member by name or handle."
            onChange={handleSearchChange}
            value={searchTerm}
            className="w-full focus:outline-none font-dmSans font-medium  text-[10.96px] leading-[14.26px] tracking-[-0.04em] sm:text-[9.34px] sm:leading-[12.16px] sm:tracking-[-0.37px]  lg:text-[15.94px] lg:leading-[20.75px] lg:tracking-[-0.04em] placeholder:text-seventy text-primary"
          />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {filteredUsers.length === 0 && searchTerm && (
              <div className="flex flex-col items-center justify-center mt-[40px] text-center">
                <p className="text-white font-dmSans text-[18px] sm:text-[22px] lg:text-[28px]">
                  Member not found
                </p>
                <p className="text-fourty font-dmSans text-[14px] sm:text-[16px] lg:text-[20px] mt-[10px]">
                  We couldn't find any members matching "{searchTerm}"
                </p>
              </div>
            )}

            {/* Grid Container - With improved mobile layout */}
            {filteredUsers.length > 0 && (
              <div
                className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-[7.21px] sm:gap-[10px] lg:gap-[25px] w-fit`}
                style={{
                  rowGap: isMobile ? "5px" : undefined, // Reduced row gap for mobile
                  alignItems: "start", // This will help with vertical alignment
                  gridAutoRows: isMobile ? "min-content" : "auto", // This is key for mobile layout
                }}
              >
                {orderedUsers.map((user, index) => {
                  // Determine if this is the expanded user
                  const isExpanded = isMobile
                    ? index === 0 && expandedMember !== null
                    : user === filteredUsers[expandedMember];

                  return (
                    <div
                      key={index}
                      className={`font-dmSans w-[175.69px] sm:w-[210.92px] lg:w-[360px] sm:gap-[5.86px] lg:gap-[10px] rounded-[10px] border border-[#FFFFFF26] p-[8px] lg:p-[15px] flex justify-between transition-all duration-300`}
                      style={getCardStyle(index, orderedUsers)}
                    >
                      {/* Default Content - Show Only If Not Expanded */}
                      {!isExpanded && (
                        <div className="flex justify-between gap-[11.73px] sm:gap-[5.27px] lg:gap-[23.44px] w-full">
                          <div className="flex flex-col gap-[4.92px] sm:gap-[9px]">
                            <p className="text-white font-medium text-[14.94px] leading-[19.46px] tracking-[-0.04em]   sm:text-[16.4px] sm:leading-[21.36px] sm:tracking-[-0.66px] lg:text-[28px] lg:leading-[36.46px] lg:tracking-[-1.12px] ">
                              {user?.name}
                            </p>
                            <div className="text-fourty flex flex-col gap-[2.73px] sm:gap-[2.93px] lg:gap-[5px] font-medium text-[9.61px] leading-[12.51px] tracking-[-0.04em] sm:text-[10.55px] sm:leading-[13.73px] sm:tracking-[-0.42px] lg:text-[18px] lg:leading-[23.44px] lg:tracking-[-0.72px]">
                              <p>{user?.role}</p>
                              <p>{user?.telegram}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              // Find the original index in filteredUsers
                              const originalIndex = filteredUsers.findIndex(
                                (u) => u === user
                              );
                              handleExpand(originalIndex);
                            }}
                            className="cursor-pointer w-[73.67px] h-[34.91px] rounded-[5.34px] p-[5.34px] gap-[2.67px] sm:w-[80.72px] sm:h-[38.06px] sm:gap-[2.93px] sm:rounded-[5.86px] sm:p-[5.86px] lg:w-[137px] lg:h-[64.06px]  lg:gap-[5px]  lg:rounded-[10px]  lg:p-[10px] flex flex-col bg-primary items-end"
                          >
                            <img
                              src={pointsarrow}
                              alt=""
                              className="h-[8.77px] w-[16.94px] sm:w-[18.16px] sm:h-[9.41px] gap-[0.33px] lg:min-w-[31px] min-h-[16.06px]"
                            />
                            <p className="font-medium text-[9.61px] leading-[12.51px] tracking-[-0.04em] sm:text-[10.55px] sm:leading-[13.73px] sm:tracking-[-0.42px] lg:text-[18px] lg:leading-[23.44px] lg:tracking-[-0.72px] text-center text-black">
                              Allocate Points
                            </p>
                          </button>
                        </div>
                      )}

                      {/* Expanded Content - Show Only If Expanded */}
                      {isExpanded && (
                        <div className="flex flex-col gap-[13.07px] sm:gap-[12.89px] lg:gap-[22px] w-full">
                          <div className="flex justify-between">
                            <p className="text-white font-medium text-[26.13px] leading-[34.03px] tracking-[-0.04em] sm:text-[16.4px] sm:leading-[21.36px] sm:tracking-[-0.66px] lg:text-[28px] lg:leading-[36.46px] lg:tracking-[-1.12px] ">
                              {user?.name}
                            </p>
                            <div className="text-fourty flex flex-col gap-[4.67px] sm:gap-[2.93px] lg:gap-[5px] font-medium text-[16.8px] leading-[21.87px] tracking-[-0.04em] sm:text-[10.55px] sm:leading-[13.73px] sm:tracking-[-0.42px] lg:text-[18px] lg:leading-[23.44px] lg:tracking-[-0.72px]">
                              <p>{user?.role}</p>
                              <p>{user?.telegram}</p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-[14px]">
                            <div className="flex justify-between sm:gap-[8.2px] lg:gap-[14px]">
                              <div className="flex gap-[2.93px] lg:gap-[5px] ">
                                {[1, 2, 3, 4, 5].map((point) => (
                                  <button
                                    key={point}
                                    onClick={() => setSelectedPoint(point)}
                                    className={`font-dmSans cursor-pointer font-normal w-[28px] h-[36.4px] gap-[9.33px] rounded-[9.33px] text-[14.93px] leading-[19.44px] sm:w-[17.58px] sm:h-[22.85px] sm:gap-[5.86px] sm:rounded-[5.86px] border-[0.35px]  sm:text-[9.37px] sm:leading-[12.21px] lg:text-[16px] lg:leading-[20.83px] tracking-[0%] text-center transition-colors lg:w-[30px] lg:h-[39px] lg:gap-[10px] lg:rounded-[10px] border-[#FFFFFF99] lg:border-[0.6px] ${
                                      selectedPoint === point
                                        ? "bg-white text-black"
                                        : "text-primary"
                                    }`}
                                  >
                                    {point}
                                  </button>
                                ))}
                              </div>
                              {/* Category Selection */}
                              <div
                                className="flex flex-col relative"
                                ref={dropdownRef}
                              >
                                <div
                                  onClick={() => setDropdownOpen(!dropdownOpen)}
                                  className={`w-[136.27px] h-[37.33px] gap-[4.67px] rounded-[9.33px] sm:w-[87.54px] sm:h-[23.44px] text-[13.07px]  sm:rounded-[5.86px] border-[0.41px]   sm:text-[9.37px] sm:leading-[12.21px] sm:tracking-[-0.19px]  lg:rounded-[12.55px] lg:border-[0.88px] border-white/20 flex items-center lg:h-[40px] justify-center  font-normal cursor-pointer lg:text-[14px] lg:leading-[23.44px] lg:w-[146px] font-dmSans lg:tracking-[0] ${
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
                                    className=" transition-transform duration-200 ease-in-out w-[13px] h-[13px]  sm:w-[8.79px] sm:h-[8.79px] lg:w-fit lg:h-fit "
                                    style={{
                                      transform: dropdownOpen
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                    }}
                                  />
                                </div>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                  <div className="absolute top-[100%] -mt-1.5 w-[173px] lg:max-h-[360px] overflow-auto rounded-[10px]   px-[10px] bg-white shadow-lg z-10 transition-all duration-200 ease-in-out opacity-100 scale-100">
                                    {Category.map((cat) => (
                                      <div
                                        key={cat}
                                        onClick={() => {
                                          setSelectedCategory(cat);
                                          setDropdownOpen(false);
                                        }}
                                        className="text-center font-dmSans font-medium text-[15px] leading-[19.53px] border-b-[0.6px] border-[#00000033] py-[9.7px] cursor-pointer "
                                      >
                                        {cat}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <input
                                placeholder="Explain why you're allocating points"
                                className=" w-full h-[37.33px] gap-[9.33px] rounded-[9.33px] border-[0.65px] text-[13.07px] leading-[17.01px]  py-[11.2px] px-[14.93px]  sm:h-[23.44px] sm:gap-[5.86px] sm:rounded-[5.86px] sm:border-[0.41px]  sm:px-[9.37px] sm:py-[7.03px]  sm:text-[8.2px] sm:leading-[10.68px] lg:w-[330px] lg:h-[40px] lg:gap-[10px] lg:rounded-[10px] border-[#FFFFFF33] lg:border-[0.7px] lg:p-[12px] lg:pr-[16px] lg:pl-[16px] outline-none placeholder:text-white/40 placeholder:font-normal placeholder:tracking-[0] lg:placeholder:text-[14px] lg:placeholder:leading-[23.44px] lg:text-[14px] lg:leading-[24.74px] font-dmSans lg:tracking-[-0.76px] text-primary"
                                value={feedback}
                                onChange={(e) => {
                                  if (e.target.value.length <= 100) {
                                    setFeedback(e.target.value);
                                  }
                                }}
                              />
                              <div className="flex justify-end font-dmSans font-normal text-[11.2px] leading-[14.58px]  sm:text-[7px] lg:text-[12px] lg:leading-[15.62px] mt-[4px]">
                                <span
                                  className={`text-${
                                    feedback.length === 100
                                      ? "red-500"
                                      : "fourty"
                                  }`}
                                >
                                  {feedback.length}/100
                                </span>
                              </div>
                            </div>
                            {errorMessage && (
                              <div className=" text-[#DC2626] font-dmSans  text-[12px]   ">
                                {errorMessage}
                              </div>
                            )}
                            {allocationSuccess ? (
                              <div className="flex gap-[10px] h-[40.67px] sm:gap-[9.33px]  rounded-[9.33px] p-[9.33px]  sm:rounded-[10px] sm:h-[25.72px]  sm:py-[5.86px]  lg:p-[25px]   bg-[#50BA77] text-white items-center justify-center w-full">
                                <img
                                  src={pointsarrowwhite}
                                  alt=""
                                  className="w-[28.93px] h-[14.99px] sm:w-[18.16px] sm:h-[9.41px] lg:min-w-[31px] lg:min-h-[16.06px]"
                                />
                                <p className="font-medium text-[16.8px] leading-[21.87px] tracking-[-0.04em] sm:text-[10.55px] sm:leading-[13.73px] sm:tracking-[-4%]  lg:text-[18px] lg:leading-[23.44px] lg:tracking-[-0.72px] italic text-center overflow-hidden text-ellipsis whitespace-nowrap max-w-[250px]">
                                  You allocated {selectedPoint} points to{" "}
                                  {user?.name}
                                </p>
                              </div>
                            ) : (
                              <button
                                onClick={() => allocatePoints(user)}
                                disabled={isAllocating || buttonDisabled}
                                className="cursor-pointer flex gap-[10px] h-[40.67px] sm:gap-[9.33px] rounded-[9.33px] p-[9.33px] sm:rounded-[10px] sm:h-[25.72px] sm:py-[5.86px] lg:p-[10px] lg:h-fit bg-primary items-center justify-center w-full disabled:opacity-70 "
                              >
                                {isAllocating ? (
                                  <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                                    <span className="ml-2 font-medium text-[16.8px] leading-[21.87px] tracking-[-0.04em] sm:text-[10.55px] sm:leading-[13.73px] sm:tracking-[-4%] lg:text-[18px] lg:leading-[23.44px] lg:tracking-[-0.72px] text-center text-black">
                                      Allocating...
                                    </span>
                                  </div>
                                ) : (
                                  <>
                                    <img
                                      src={pointsarrow}
                                      alt=""
                                      className="w-[28.93px] h-[14.99px] sm:max-w-[18.16px] sm:max-h-[9.41px] lg:min-w-[31px] lg:min-h-[16.06px]"
                                    />
                                    <p className="font-medium text-[16.8px] leading-[21.87px] tracking-[-0.04em] sm:text-[10.55px] sm:leading-[13.73px] sm:tracking-[-4%] lg:text-[18px] lg:leading-[23.44px] lg:tracking-[-0.72px] text-center text-black">
                                      Allocate Points
                                    </p>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Error message for main content loading */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center mt-[40px] text-center">
            <p className="text-[#DC2626] font-dmSans text-[18px] sm:text-[22px] lg:text-[28px]">
              Error Loading Members
            </p>
            <p className="text-fourty font-dmSans text-[14px] sm:text-[16px] lg:text-[20px] mt-[10px]">
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PointsAllocationCard;
