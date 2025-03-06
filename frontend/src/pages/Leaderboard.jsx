import React, { useState, useEffect, useRef } from "react";
import mark from "../assets/images/Mark.svg";
import search from "../assets/images/search.svg";
import filter from "../assets/images/filter.svg";
import closeIcon from "../assets/images/close.svg"; // Add a cancel icon
import LeaderboardTable from "../components/LeaderboardTable";
import axios from "axios";
import { useSelector } from "react-redux";
const Leaderboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const dropdownRef = useRef(null); // Reference for dropdown
  const [contributions, setContributions] = useState([]);
  const Category = ["Weekly", "Monthly", "All-Time"];
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const fetchContributors = async () => {
      try {
        // Convert selected category to API filter parameter
        const filterParam = selectedCategory
          ? selectedCategory.toLowerCase()
          : "all-time";

        const response = await axios.get(
          `http://localhost:5000/api/leaderboard/top-contributors?filter=${filterParam}`
        );
        setContributions(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching contributors:", error);
      }
    };

    fetchContributors();
  }, [selectedCategory]);
  const filteredContributions = contributions.filter((contributor) =>
    contributor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
 const currentUser = useSelector((state) => state.user.currentUser);

  return (
    <div>
      <div className="px-[9px] sm:px-[60px] lg:px-[80px] pb-[15rem] min-h-screen">
        <div className="flex flex-col gap-[18px] sm:gap-[20px]">
          <div className="flex gap-[10px] items-center">
            <img
              src={mark}
              alt=""
              className="h-[32.52px] w-[32.52px] sm:h-[44px] sm:w-[44px]"
            />
            <p className="text-primary thunder-medium font-medium text-[31.04px] leading-[28.56px] sm:text-[42px] sm:leading-[38.64px]">
              Hello, {currentUser?.user?.name}.
            </p>
          </div>
          <p className="font-dmSans font-medium text-[14px] leading-[18.23px]   sm:text-[18px] md:text-[22px] sm:leading-[28.64px] tracking-[-0.04em] text-primary">
            Leaderboard & Members List
          </p>
        </div>

        <div className="flex gap-[12px] items-center relative pt-[20px] sm:pt-[25px] md:pt-[35px] lg:pt-[50px]">
          {/* Search Bar */}
          <div
            style={{
              background:
                "linear-gradient(0deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 99.17%)",
            }}
            className="w-[263px] h-[34.08px] gap-[6.09px] rounded-[2.43px] border-[0.61px] p-[9.74px] sm:w-[578.23px] sm:h-[49.59px] sm:gap-[8.85px] sm:rounded-[3.54px] sm:border-[0.89px] border-[#FFFFFF12] sm:p-[14.17px] flex items-center"
          >
            <img
              src={search}
              alt=""
              className="w-[14.61px] h-[14.61px] sm:h-fit sm:w-fit"
            />
            <input
              type="text"
              placeholder="Search for Members"
              value={searchQuery} // Bind input to search query state
              onChange={(e) => setSearchQuery(e.target.value)} // Handle input change
              className="w-full focus:outline-none font-dmSans font-medium  text-[10.96px] leading-[14.26px] tracking-[-0.04em] sm:text-[15.94px] sm:leading-[20.75px] sm:tracking-[-0.04em] placeholder:text-seventy text-primary"
            />
          </div>

          {/* Filter Button & Dropdown */}
          <div ref={dropdownRef} className="relative">
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-[34.08px] h-[34.08px] rounded-[2.43px] border-[0.61px] sm:w-[49.59px] sm:h-[49.59px] sm:rounded-[3.54px] sm:border-[0.89px] border-[#FFFFFF12] p-[9.74px] sm:p-[14.17px] flex items-center cursor-pointer"
              style={{
                background:
                  "linear-gradient(0deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 99.17%)",
              }}
            >
              <img
                src={filter}
                alt=""
                className="w-[14.61px] h-[14.61px] sm:h-fit sm:w-fit"
              />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-12 left-0 w-[90px] lg:w-[114px] rounded-[10px] border border-black px-[10px] bg-white shadow-lg z-10">
                {Category.map((cat) => (
                  <div
                    key={cat}
                    className="text-center font-dmSans font-normal text-[10px] lg:text-[14px] leading-[18.23px] border-b-[0.6px] border-[#00000033] py-[5px] lg:py-[9.7px] cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Category Display */}
          {selectedCategory && (
            <div className="flex items-center justify-center bg-white h-[34.08px] sm:w-[130px] sm:h-[50px] gap-[10px] rounded-[5px] sm:rounded-[7px] lg:rounded-[10px] p-[10px] shadow-md border">
              <span className="font-dmSans text-[13px] lg:text-[16px] font-normal">
                {selectedCategory}
              </span>
              <img
                src={closeIcon}
                alt="Remove"
                className="h-[13px]  w-[13px] lg:h-4 lg:w-4 cursor-pointer"
                onClick={() => setSelectedCategory(null)}
              />
            </div>
          )}
        </div>

        <div className="pt-[15px] sm:pt-8">
          <LeaderboardTable contributions={filteredContributions} />
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
