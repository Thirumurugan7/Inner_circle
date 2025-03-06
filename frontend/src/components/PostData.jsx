import React, { useState, useEffect } from "react";
import axios from "axios";

const PostData = () => {
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to format the date properly
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    const suffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${suffix(day)} ${month} ${year}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch few help requests
        const response = await axios.get(
          "http://localhost:5000/api/helprequest/fewhelprequest"
        );

        const formattedData = response.data.helpRequests.map((request) => ({
          description: request.description || "No description",
          date: formatDate(request.createdAt),
          name: request.user?.name || "Unknown",
          telegram: request.telegram || "N/A",
        }));

        setHelpRequests(formattedData);
      } catch (error) {
        console.error("Error fetching help requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* post data */}
      <div className="flex flex-wrap gap-[11.57px] lg:gap-[20px] mt-[18px] lg:mt-[30px]">
        {helpRequests.map((data, index) => (
          <div
            key={index}
            className="font-dmSans flex h-[41.88px] sm:h-fit border-[#FFFFFF1A] gap-[17.35px] rounded-[5.78px] border-[0.58px] p-[6.94px_11.57px] sm:gap-[30px] sm:py-[8px] sm:px-[15px] md:py-[12px] md:px-[20px] sm:rounded-[10px] bg-[#FFFFFF14] noiseeffect sm:border-[1px] w-fit"
          >
            <div className="flex flex-col justify-between">
              <p className="font-medium text-[12.73px] leading-[16.57px] tracking-[-0.04em] sm:text-[13.89px] sm:leading-[16.78px] sm:tracking-[-0.52px]  lg:text-[22px] lg:leading-[28.64px] lg:tracking-[-0.88px] text-primary">
                {data?.description}
              </p>
              <p className="text-thirty font-medium text-[6.94px] leading-[9.04px] tracking-[-0.04em] sm:text-[9px] lg:text-[12px] lg:leading-[15.62px] sm:tracking-[-0.48px]">
                {data?.date}
              </p>
            </div>
            <div className="flex flex-col justify-between">
              <p className="text-primary font-medium text-[10.41px] leading-[13.56px] tracking-[-0.04em] sm:text-[11px] lg:text-[18px] lg:leading-[23.44px] lg:tracking-[-0.72px]">
                {data?.name}
              </p>
              <p className="text-fourty font-medium text-[10.41px] leading-[13.56px] tracking-[-0.04em] sm:text-[11px] lg:text-[18px] lg:leading-[23.44px] lg:tracking-[-0.72px]">
                @{data?.telegram}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostData;
