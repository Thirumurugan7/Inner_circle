import React,{useEffect, useState} from 'react'
import PointsandContribution from '../components/PointsandContribution';
import { Web3Auth } from "@web3auth/modal";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signOutSuccess } from '../components/redux/user/userSlice';
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../components/auth/AuthContext";
import axios from 'axios';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [web3auth, setWeb3Auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contribution, setContribution] = useState({});
    const [userData, setUserData] = useState(null);
    const [pointsHistory, setPointsHistory] = useState([]);
    const [Loading, setLoading] = useState(false);
  const { login, isLoggedIn, loading, user, logout, error } = useAuth();

  // Modify your logout handler to clean up all authentication states
  const handleLogout = async () => {
    try {
      // First call the auth context logout function
      await logout();

      // Also dispatch Redux action to clear user state
      dispatch(signOutSuccess());

      // If you're using Web3Auth and need to clean up its state
      if (web3auth) {
        await web3auth.logout();
        setWeb3Auth(null);
        setProvider(null);
      }

      // Navigate to home page or login page after logout
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  // Replace with actual wallet address

  useEffect(() => {
    const walletAddress = currentUser?.user?.walletAddress;
   console.log(currentUser)
    const fetchUserByWallet = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/auth/getUsersByWalletAddress`,
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
  }, [currentUser]);

  // Replace with actual wallet address

  useEffect(() => {
    const fetchContributionandPoints = async () => {
      if (!currentUser?.user?.walletAddress) return; // Ensure walletAddress exists
      const walletAddress = currentUser.user.walletAddress;
      console.log(walletAddress);
      try {
        const response = await axios.get(
          `http://localhost:5001/api/action/pointandAllocation`,
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
  }, [currentUser]);
  const lastContributionTime = contribution?.data?.latestHelpAction?.createdAt;


 useEffect(() => {
   const fetchHelpActions = async () => {
     if (!currentUser?.user?.walletAddress) return;
     const walletAddress = currentUser.user.walletAddress;
     console.log(walletAddress);
     setLoading(true); // Start loading
     try {
       const response = await axios.get(
         `http://localhost:5001/api/action/gethelpactionByWallet`,
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
 }, [currentUser]);
  return (
    <div className=" px-[9px] sm:px-[60px] lg:px-[80px] pb-[5rem]">
      <div className="flex flex-col gap-[20.23px] md:gap-[45px]">
        {/* personal info */}
        <div className="flex flex-col gap-[11.56px] sm:gap-[15px] md:gap-[20px]">
          <p className="font-dmSans font-medium italic  text-[16.18px] leading-[21.07px] tracking-[-0.65px] sm:text[16.4px] sm:leading-[21.36px] sm:tracking-[-0.66px] lg:text-[28px] lg:leading-[36.46px]  underline decoration-solid decoration-auto decoration-[auto] decoration-skip-ink-auto text-primary">
            Personal info
          </p>
          <div className="flex flex-col gap-[11.56px] sm:gap-[11.72px] lg:gap-[15px] md:gap-[20px] font-normal text-[12.71px] leading-[16.55px] tracking-[-0.51px] font-dmSans  sm:text-[12.89px] sm:leading-[16.78px] sm:tracking-[-0.52px] lg:text-[22px] lg:leading-[28.64px] lg:tracking-[-0.04em]">
            {currentUser?.user?.name && (
              <div className="flex gap-[62.41px] sm:gap-[80px]  md:gap-[108px] items-center">
                <p className=" text-primary w-[83.79px] sm:w-[120px] md:w-[145px]">
                  Name
                </p>
                <p className=" text-sixty sm:w-fit">
                  {currentUser?.user?.name}
                </p>
              </div>
            )}
            {currentUser?.user?.role && (
              <div className="flex gap-[62.41px] sm:gap-[80px]  md:gap-[108px] items-center">
                <p className=" text-primary w-[83.79px] sm:w-[120px] md:w-[145px]">
                  Role
                </p>
                <p className=" text-sixty w-fit">{currentUser?.user?.role}</p>
              </div>
            )}
            {currentUser?.user?.email && (
              <div className="flex gap-[62.41px] sm:gap-[80px]  md:gap-[108px] items-center">
                <p className=" text-primary w-[83.79px] sm:w-[120px] md:w-[145px]">
                  Email Id
                </p>
                <p className=" text-sixty w-fit">
                  {currentUser?.user?.email}
                </p>
              </div>
            )}
            {currentUser?.user?.walletAddress && (
              <div className="flex gap-[62.41px] sm:gap-[80px]  md:gap-[108px] items-center">
                <p className=" text-primary w-[83.79px] sm:w-[120px] md:w-[145px]">
                  Wallet Address
                </p>
                <p className=" text-sixty break-words w-fit  max-w-[200px] sm:max-w-full">
                  {currentUser?.user?.walletAddress}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* social links */}
        <div className="flex flex-col gap-[11.56px] sm:gap-[15px] md:gap-[20px]">
          <p className="font-dmSans font-medium italic  text-[16.18px] leading-[21.07px] tracking-[-0.65px] sm:text[16.4px] sm:leading-[21.36px] sm:tracking-[-0.66px] lg:text-[28px] lg:leading-[36.46px]  underline decoration-solid decoration-auto decoration-[auto] decoration-skip-ink-auto text-primary">
            Social Links
          </p>
          <div className="flex flex-col gap-[11.56px] sm:gap-[11.72px] lg:gap-[15px] md:gap-[20px] font-normal text-[12.71px] leading-[16.55px] tracking-[-0.51px] font-dmSans  sm:text-[12.89px] sm:leading-[16.78px] sm:tracking-[-0.52px] lg:text-[22px] lg:leading-[28.64px] lg:tracking-[-0.04em">
            {currentUser?.user?.twitterId &&
              <div className="flex gap-[62.41px] sm:gap-[80px] md:gap-[108px] items-center">
                <p className=" text-primary w-[83.79px] sm:w-[121px] md:w-[145px]">
                  Twitter
                </p>
                <p className=" text-sixty w-fit ">
                  {currentUser?.user?.twitterId}
                </p>
              </div>
            }
            {currentUser?.user?.github &&
              <div className="flex gap-[62.41px] sm:gap-[80px] md:gap-[108px] items-center">
                <p className=" text-primary w-[83.79px] sm:w-[121px] md:w-[145px]">
                  Github
                </p>
                <p className=" text-sixty w-fit ">
                  {currentUser?.user?.github}
                </p>
              </div>
            }
            { currentUser?.user?.website &&
              <div className="flex gap-[62.41px] sm:gap-[80px] md:gap-[108px] items-center">
                <p className=" text-primary w-[83.79px] sm:w-[121px] md:w-[145px]">
                  Website
                </p>
                <p className=" text-sixty w-fit ">
                  {currentUser?.user?.website}
                </p>
              </div>
            }
            { currentUser?.user?.telegram &&
              <div className="flex gap-[62.41px] sm:gap-[80px] md:gap-[108px] items-center">
                <p className=" text-primary w-[83.79px] sm:w-[121px] md:w-[145px]">
                  Telegram
                </p>
                <p className=" text-sixty w-fit ">
                  {currentUser?.user?.telegram}
                </p>
              </div>
            }
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
        <div className="flex flex-col gap-[11.56px] sm:gap-[15px] md:gap-[20px]">
          <p className="font-dmSans font-medium italic  text-[16.18px] leading-[21.07px] tracking-[-0.65px] sm:text[16.4px] sm:leading-[21.36px] sm:tracking-[-0.66px] lg:text-[28px] lg:leading-[36.46px]  underline decoration-solid decoration-auto decoration-[auto] decoration-skip-ink-auto text-primary">
            Recent Points History
          </p>
          <PointsandContribution
            pointsHistory={pointsHistory}
            Loading={Loading}
          />
        </div>
        {/* logout */}
        <div className="flex gap-[10px]">
          <Link to="/update-profile">
            <button
              className="font-dmSans cursor-pointer w-[69.93px] h-[25.56px] sm:rounded-[5.86px] sm:p-[5.86px] sm:text-[10.55px] lg:h-[43px] rounded-[5.78px] border-[0.58px] border-primary
  px-[5.78px] py-[5.78px] text-[10.4px] leading-[13.54px] lg:w-[121px] text-center font-medium lg:text-[18px] lg:leading-[23.44px] tracking-[0%]  bg-black text-white lg:rounded-[10px]  lg:p-[10px]"
            >
              Edit
            </button>
          </Link>

          <button
            onClick={handleLogout}
            className="font-dmSans cursor-pointer w-[69.93px] h-[25.56px] sm:rounded-[5.86px] sm:p-[5.86px] sm:text-[10.55px] lg:h-[43px] rounded-[5.78px] border-[0.58px] 
  px-[5.78px] py-[5.78px] text-[10.4px] leading-[13.54px] lg:w-[121px] text-center font-medium lg:text-[18px] lg:leading-[23.44px] tracking-[0%]  bg-white text-black lg:rounded-[10px]  lg:p-[10px]"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile
