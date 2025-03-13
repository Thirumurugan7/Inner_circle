import React, { useEffect, useState } from "react";
import PointsandContribution from "../components/PointsandContribution";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { useParams } from "react-router-dom";

const SocialProfile = () => {
  const [contribution, setContribution] = useState({});
  const [userData, setUserData] = useState(null);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [Loading, setLoading] = useState(false);
  const {walletAddress} = useParams();

  // Modify your logout handler to clean up all authentication states

  // Replace with actual wallet address

  useEffect(() => {
    const fetchUserByWallet = async () => {
      try {
        const response = await axios.get(
          `https://inner-circle-nine.vercel.app/api/auth/getUsersByWalletAddress`,
          {
            params: { walletAddress },
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data?.users?.length > 0) {
          const user = response.data.users[0];
          setUserData(user);
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
  }, [walletAddress]);

  // Replace with actual wallet address

  useEffect(() => {
    const fetchContributionandPoints = async () => {
      if (!walletAddress) return; // Ensure walletAddress exists
      console.log(walletAddress);
      try {
        const response = await axios.get(
          `https://inner-circle-nine.vercel.app/api/action/pointandAllocation`,
          {
            params: { walletAddress },
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Fetched Help Actions:", response.data.data);

        // Format data for the table

        setContribution(response.data);
      } catch (error) {
        console.error("Error fetching help actions:", error);
      }
    };

    fetchContributionandPoints();
  }, [walletAddress]);
  const lastContributionTime = contribution?.data?.latestHelpAction?.createdAt;

  useEffect(() => {
    const fetchHelpActions = async () => {
      if (!walletAddress) return; // Only return if walletAddress is NOT defined
      console.log(walletAddress);
      setLoading(true); // Start loading
      try {
        const response = await axios.get(
          `https://inner-circle-nine.vercel.app/api/action/gethelpactionByWallet`,
          {
            params: { walletAddress },
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Fetched Help Actions:", response.data);

        const formattedData = response.data.map((action) => ({
          date: new Date(action.createdAt).toLocaleDateString(),
          pointsEarned: `+${action.pointsAllocated} pts`,
          category: action.category,
          givenBy: action.helpedUser?.name || "Unknown",
          description: action.feedback,
        }));

        setPointsHistory(formattedData);
      } catch (error) {
        console.error("Error fetching help actions:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchHelpActions();
  }, [walletAddress]); // Add walletAddress to dependency array

  return (
    <div className=" px-[9px] sm:px-[60px] lg:px-[80px] pb-[5rem]">
      <div className="flex flex-col gap-[20.23px] md:gap-[45px]">
        {/* personal info */}
        <div className="flex flex-col gap-[11.56px] sm:gap-[15px] md:gap-[20px]">
          <p className="font-dmSans font-medium italic  text-[16.18px] leading-[21.07px] tracking-[-0.65px] sm:text[16.4px] sm:leading-[21.36px] sm:tracking-[-0.66px] lg:text-[28px] lg:leading-[36.46px]  underline decoration-solid decoration-auto decoration-[auto] decoration-skip-ink-auto text-primary">
            Personal info
          </p>
          <div className="flex flex-col gap-[11.56px] sm:gap-[11.72px] lg:gap-[15px] md:gap-[20px] font-normal text-[12.71px] leading-[16.55px] tracking-[-0.51px] font-dmSans  sm:text-[12.89px] sm:leading-[16.78px] sm:tracking-[-0.52px] lg:text-[22px] lg:leading-[28.64px] lg:tracking-[-0.04em]">
            {userData?.name && <div className="flex gap-[62.41px] sm:gap-[80px]  md:gap-[108px] items-center">
              <p className=" text-primary w-[83.79px] sm:w-[120px] md:w-[145px]">
                Name
              </p>
              <p className=" text-sixty sm:w-fit">{userData?.name}</p>
            </div>}
            {userData?.role && <div className="flex gap-[62.41px] sm:gap-[80px]  md:gap-[108px] items-center">
              <p className=" text-primary w-[83.79px] sm:w-[120px] md:w-[145px]">
                Role
              </p>
              <p className=" text-sixty w-fit">{userData?.role}</p>
            </div>}
           {userData?.email && <div className="flex gap-[62.41px] sm:gap-[80px]  md:gap-[108px] items-center">
              <p className=" text-primary w-[83.79px] sm:w-[120px] md:w-[145px]">
                Email Id
              </p>
              <p className=" text-sixty w-fit">{userData?.email}</p>
            </div>}
            {userData?.walletAddress && <div className="flex gap-[62.41px] sm:gap-[80px]  md:gap-[108px] items-center">
              <p className=" text-primary w-[83.79px] sm:w-[120px] md:w-[145px]">
                Wallet Address
              </p>
              <p className=" text-sixty break-words w-fit  max-w-[200px] sm:max-w-full">
                {userData?.walletAddress}
              </p>
            </div>}
          </div>
        </div>

        {/* social links */}
        <div className="flex flex-col gap-[11.56px] sm:gap-[15px] md:gap-[20px]">
          <p className="font-dmSans font-medium italic  text-[16.18px] leading-[21.07px] tracking-[-0.65px] sm:text[16.4px] sm:leading-[21.36px] sm:tracking-[-0.66px] lg:text-[28px] lg:leading-[36.46px]  underline decoration-solid decoration-auto decoration-[auto] decoration-skip-ink-auto text-primary">
            Social Links
          </p>
          <div className="flex flex-col gap-[11.56px] sm:gap-[11.72px] lg:gap-[15px] md:gap-[20px] font-normal text-[12.71px] leading-[16.55px] tracking-[-0.51px] font-dmSans  sm:text-[12.89px] sm:leading-[16.78px] sm:tracking-[-0.52px] lg:text-[22px] lg:leading-[28.64px] lg:tracking-[-0.04em">
           {userData?.twitterId && <div className="flex gap-[62.41px] sm:gap-[80px] md:gap-[108px] items-center">
              <p className=" text-primary w-[83.79px] sm:w-[121px] md:w-[145px]">
                Twitter
              </p>
              <p className=" text-sixty w-fit ">{userData?.twitterId}</p>
            </div>}
           {userData?.github && <div className="flex gap-[62.41px] sm:gap-[80px] md:gap-[108px] items-center">
              <p className=" text-primary w-[83.79px] sm:w-[121px] md:w-[145px]">
                Github
              </p>
              <p className=" text-sixty w-fit ">{userData?.github}</p>
            </div>}
           {userData?.website && <div className="flex gap-[62.41px] sm:gap-[80px] md:gap-[108px] items-center">
              <p className=" text-primary w-[83.79px] sm:w-[121px] md:w-[145px]">
                Website
              </p>
              <p className=" text-sixty w-fit ">{userData?.website}</p>
            </div>}
            {userData?.telegram && <div className="flex gap-[62.41px] sm:gap-[80px] md:gap-[108px] items-center">
              <p className=" text-primary w-[83.79px] sm:w-[121px] md:w-[145px]">
                Telegram
              </p>
              <p className=" text-sixty w-fit ">{userData?.telegram}</p>
            </div>}
          </div>
        </div>

        {/* Points & contribution */}
        <div className="flex flex-col gap-[11.56px] sm:gap-[15px] md:gap-[20px] ">
          <p className="font-dmSans font-medium italic  text-[16.18px] leading-[21.07px] tracking-[-0.65px] sm:text[16.4px] sm:leading-[21.36px] sm:tracking-[-0.66px] lg:text-[28px] lg:leading-[36.46px]  underline decoration-solid decoration-auto decoration-[auto] decoration-skip-ink-auto text-primary">
            Points & Contributions
          </p>
          <div className="flex flex-col gap-[11.56px] sm:gap-[11.72px] lg:gap-[15px] md:gap-[20px] font-normal text-[12.71px] leading-[16.55px] tracking-[-0.51px] font-dmSans  sm:text-[12.89px] sm:leading-[16.78px] sm:tracking-[-0.52px] lg:text-[22px] lg:leading-[28.64px] lg:tracking-[-0.04em">
            <div className="flex gap-[40.45px] sm:gap-[60px] md:gap-[70px] items-center">
              <p className=" text-primary w-[106px] sm:w-[143px] md:w-[184px]">
                Total Points Earned
              </p>
              <p className=" text-sixty w-fit">
                {contribution?.data?.totalPoints}
              </p>
            </div>
            <div className="flex gap-[40.45px] sm:gap-[60px] md:gap-[70px] items-center">
              <p className=" text-primary w-[106px] sm:w-[143px] md:w-[183px]">
                Top Contributions
              </p>
              <p className=" text-sixty w-fit">
                {contribution?.data?.topcontribution}
              </p>
            </div>
            <div className="flex gap-[40.45px] sm:gap-[60px] md:gap-[70px] items-center">
              <p className=" text-primary w-[106px] sm:w-[143px] md:w-[183px]">
                Last Contribution
              </p>
              <p className=" text-sixty w-fit">
                {contribution?.data?.latestHelpAction?.category} (
                {contribution?.data?.latestHelpAction?.pointsAllocated} Points)
                -{" "}
                {lastContributionTime
                  ? formatDistanceToNow(new Date(lastContributionTime), {
                      addSuffix: true,
                    })
                  : "N/A"}
              </p>
            </div>
            <div className="flex gap-[40.45px] sm:gap-[60px] md:gap-[70px] items-center">
              <p className=" text-primary w-[106px] sm:w-[143px] md:w-[183px]">
                Top Category
              </p>
              <p className=" text-sixty w-fit">
                {contribution?.data?.maxCategory} (
                {contribution?.data?.maxPoints}  projects)
              </p>
            </div>
          </div>
        </div>

        {/* Recent post History */}
        {/* <div className="flex flex-col gap-[11.56px] sm:gap-[15px] md:gap-[20px]">
          <p className="font-dmSans font-medium italic  text-[16.18px] leading-[21.07px] tracking-[-0.65px] sm:text[16.4px] sm:leading-[21.36px] sm:tracking-[-0.66px] lg:text-[28px] lg:leading-[36.46px]  underline decoration-solid decoration-auto decoration-[auto] decoration-skip-ink-auto text-primary">
            Recent Points History
          </p>
          <PointsandContribution
            pointsHistory={pointsHistory}
            Loading={Loading}
          />
        </div> */}
        {/* logout */}
      </div>
    </div>
  );
};

export default SocialProfile;
