import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import search from "../assets/images/search.svg";
import filter from "../assets/images/filter.svg";
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaCircleChevronRight } from "react-icons/fa6";

const HelpRequestTable = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const navigate = useNavigate();

  // Function to format the date as "Feb 17, 2025"
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    const formattedDate = date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    return formattedDate;
  };

  // Function to determine the text color based on urgency
  const getUrgencyColor = (urgency) => {
    switch (urgency.toLowerCase()) {
      case "low":
        return "text-[#16A34A]";
      case "medium":
        return "text-[#EAB308]"; // Yellow for medium urgency
      case "high":
        return "text-[#DC2626]"; // Red for high urgency
      default:
        return "text-white";
    }
  };

  // Handler to navigate to social profile
  const handleUserClick = (walletAddress) => {
    navigate(`/social-profile/${walletAddress}`);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "https://inner-circle-nine.vercel.app/api/helprequest/allrequest"
        );

        const formattedData = response.data.helpRequests.map((request) => ({
          requestTitle: request.description,
          postedBy: request.user?.name || "Unknown",
          walletAddress: request.user?.walletAddress || "",
          telegram: request.telegram || "N/A",
          datePosted: formatDate(request.createdAt),
          category: request.category,
          urgency: request.urgency,
        }));

        setRequests(formattedData);
        setFilteredRequests(formattedData);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Filter requests based on search query
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching

    if (query === "") {
      setFilteredRequests(requests); // Show all requests when the search is empty
    } else {
      const filteredData = requests.filter((record) =>
        Object.values(record).some((value) =>
          value.toLowerCase().includes(query.toLowerCase())
        )
      );
      setFilteredRequests(filteredData);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Pagination render function
  const renderPagination = () => {
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    if (totalPages <= 1) return null;

    const maxDisplayPages = 5;

    const getPageNumbers = () => {
      if (totalPages <= maxDisplayPages) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const pages = [];
      const leftSide = Math.max(1, currentPage - 1);
      const rightSide = Math.min(totalPages, currentPage + 1);

      if (leftSide > 1) {
        pages.push(1);
        if (leftSide > 2) pages.push("...");
      }

      for (let i = leftSide; i <= rightSide; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (rightSide < totalPages) {
        if (rightSide < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }

      return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
      <div className="flex justify-center items-center space-x-1 mt-4 ">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-xl bg-gray-700 cursor-pointer text-white disabled:opacity-50 rounded-full"
        >
          <FaCircleChevronLeft />
        </button>

        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-1 text-xs sm:px-3 sm:py-2 text-white"
              >
                ...
              </span>
            );
          }
          return (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`px-2 py-1 text-xs sm:px-3 sm:py-2 font-dmSans font-normal cursor-pointer rounded ${
                currentPage === page ? "bg-primary text-black" : " text-white"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className=" text-xl bg-gray-700 text-white disabled:opacity-50 rounded-full cursor-pointer"
        >
          <FaCircleChevronRight />
        </button>
      </div>
    );
  };

  // Loading skeleton component for search bar
  const SearchBarSkeleton = () => (
    <div className="flex gap-[8.25px] sm:gap-[12px] items-center relative mt-[18px] sm:pt-[23px] lg:pt-[30px] xl:pt-[35px]">
      <div
        style={{
          background:
            "linear-gradient(0deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 99.17%)",
        }}
        className="w-[263px] h-[34.08px] gap-[6.09px] rounded-[2.43px] border-[0.61px] p-[9.74px] sm:w-[578.23px] sm:h-[49.59px] sm:gap-[8.85px] sm:rounded-[3.54px] sm:border-[0.89px] border-[#FFFFFF12] sm:p-[14.17px] flex items-center opacity-50"
      >
        <div className="w-[14.61px] h-[14.61px] sm:h-[21px] sm:w-[21px] bg-twenty rounded-full animate-pulse"></div>
        <div className="w-full h-[14.26px] sm:h-[20.75px] ml-2 bg-twenty rounded animate-pulse"></div>
      </div>

      <div
        className="w-[34.08px] h-[34.08px] rounded-[2.43px] border-[0.61px] sm:w-[49.59px] sm:h-[49.59px] sm:rounded-[3.54px] sm:border-[0.89px] border-[#FFFFFF12] p-[9.74px] sm:p-[14.17px] flex items-center opacity-50"
        style={{
          background:
            "linear-gradient(0deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 99.17%)",
        }}
      >
       
      </div>
    </div>
  );

  // Loading skeleton for a table row
  const SkeletonRow = () => (
    <div className="relative border-twenty border-b-[0.55px] flex px-1 sm:px-5 justify-between items-center font-dmSans font-normal text-[8.93px] leading-[11.62px] tracking-[-0.04em] sm:text-[14px] md:text-[18px] sm:leading-[23.44px] text-center text-white py-3 sm:py-5">
      <div className="w-[220px] h-4 sm:h-6 bg-twenty rounded animate-pulse mx-auto"></div>
      <div className="w-[131px] h-4 sm:h-6 bg-twenty rounded animate-pulse mx-auto"></div>
      <div className="w-[154px] h-4 sm:h-6 bg-twenty rounded animate-pulse mx-auto"></div>
      <div className="w-[117px] h-4 sm:h-6 bg-twenty rounded animate-pulse mx-auto"></div>
      <div className="w-[154px] h-4 sm:h-6 bg-twenty rounded animate-pulse mx-auto"></div>
      <div className="w-[154px] h-4 sm:h-6 bg-twenty rounded animate-pulse mx-auto"></div>

      {/* Row Bottom Dots */}
      <div className="absolute left-0 -bottom-[2px] sm:-bottom-[3px] w-[1.58px] h-[2.64px] sm:w-[4.22px] sm:h-[5.33px] bg-sixty" />
      <div className="absolute right-0 -bottom-[2px] sm:-bottom-[3px] w-[1.58px] h-[2.64px] sm:w-[4.22px] sm:h-[5.33px] bg-sixty" />
    </div>
  );

  // Loading skeleton for pagination
  const PaginationSkeleton = () => (
    <div className="flex justify-center items-center space-x-1 mt-4">
      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-twenty animate-pulse"></div>
      <div className="w-8 h-6 sm:w-10 sm:h-8 rounded bg-twenty animate-pulse"></div>
      <div className="w-8 h-6 sm:w-10 sm:h-8 rounded bg-twenty animate-pulse"></div>
      <div className="w-8 h-6 sm:w-10 sm:h-8 rounded bg-twenty animate-pulse"></div>
      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-twenty animate-pulse"></div>
    </div>
  );

  return (
    <div>
      {/* Search and Filter Section */}
      {loading ? (
        <SearchBarSkeleton />
      ) : (
        <div className="flex gap-[8.25px] sm:gap-[12px] items-center relative mt-[18px] sm:pt-[23px] lg:pt-[30px] xl:pt-[35px]">
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
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search for Members"
              className="w-full focus:outline-none font-dmSans font-medium text-[10.96px] leading-[14.26px] tracking-[-0.04em] sm:text-[15.94px] sm:leading-[20.75px] sm:tracking-[-0.04em] placeholder:text-seventy text-primary"
            />
          </div>

          {/* Filter Button */}
          
        </div>
      )}

      <div className="mt-[18px] sm:pt-[23px] lg:pt-[30px] xl:pt-[35px]">
        <div className="w-full xl:w-[1137.73px]">
          {/* Table Header */}
          <div className="relative border-twenty border-t-[0.55px] border-b-[0.55px] flex px-1 sm:px-5 justify-between items-center font-dmSans font-normal text-[8.93px] leading-[11.62px] tracking-[-0.04em] sm:text-[14px] md:text-[18px] sm:leading-[23.44px] text-center text-fifty py-3 sm:py-5">
            <div className="w-[220px]">Request Title</div>
            <div className="w-[131px]">Posted By</div>
            <div className="w-[154px]">Telegram</div>
            <div className="w-[117px]">Date Posted</div>
            <div className="w-[154px]">Category</div>
            <div className="w-[154px]">Urgency</div>
            {/* Header Dots */}
            <div className="absolute left-0 top-0 w-[1.58px] h-[2.64px] sm:w-[4.22px] sm:h-[5.33px] bg-sixty" />
            <div className="absolute right-0 top-0 w-[1.58px] h-[2.64px] sm:w-[4.22px] sm:h-[5.33px] bg-sixty" />
            <div className="absolute left-0 -bottom-[2px] sm:-bottom-[3px] w-[1.58px] h-[2.64px] sm:w-[4.22px] sm:h-[5.33px] bg-sixty" />
            <div className="absolute right-0 -bottom-[2px] sm:-bottom-[3px] w-[1.58px] h-[2.64px] sm:w-[4.22px] sm:h-[5.33px] bg-sixty" />
          </div>

          {/* Table Rows or Loading State */}
          {loading ? (
            <>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <SkeletonRow key={`skeleton-${index}`} />
                ))}
              <PaginationSkeleton />
            </>
          ) : filteredRequests.length > 0 ? (
            <>
              <div>
                {currentItems.map((record, index) => (
                  <div
                    key={index}
                    className="relative border-twenty border-b-[0.55px] flex px-1 sm:px-5 justify-between items-center font-dmSans font-normal text-[8.93px] leading-[11.62px] tracking-[-0.04em] sm:text-[14px] md:text-[18px] sm:leading-[23.44px] text-center text-white py-3 sm:py-5"
                  >
                    <div className="w-[220px] capitalize">
                      {record?.requestTitle}
                    </div>
                    <div
                      className="w-[131px] cursor-pointer hover:underline capitalize"
                      onClick={() => handleUserClick(record?.walletAddress)}
                    >
                      {record.postedBy}
                    </div>
                    <div className="w-[154px]">{record?.telegram}</div>
                    <div className="w-[117px]">{record?.datePosted}</div>
                    <div className="w-[154px]">{record?.category}</div>
                    <div
                      className={`w-[154px] ${getUrgencyColor(
                        record?.urgency
                      )}`}
                    >
                      {record?.urgency}
                    </div>
                    {/* Row Bottom Dots */}
                    <div className="absolute left-0 -bottom-[2px] sm:-bottom-[3px] w-[1.58px] h-[2.64px] sm:w-[4.22px] sm:h-[5.33px] bg-sixty" />
                    <div className="absolute right-0 -bottom-[2px] sm:-bottom-[3px] w-[1.58px] h-[2.64px] sm:w-[4.22px] sm:h-[5.33px] bg-sixty" />
                  </div>
                ))}
              </div>
              {renderPagination()}
            </>
          ) : (
            <div className="text-center text-white py-10 text-[14px] sm:text-[18px]">
              Members not found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpRequestTable;
