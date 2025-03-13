import React,{useState, useEffect} from "react";
import loginstar from "../../assets/images/loginstar.svg";
import { Link} from "react-router-dom";
import { useSelector } from "react-redux";
import bell from '../../assets/images/bell.svg';


const MobileMenu = ({ toggleMenu, isMenuOpen, setIsMenuOpen }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
    const [showNotification, setShowNotification] = useState(true);

  console.log(currentUser);
    const toggleNotification = () => {
    setShowNotification(!showNotification);
    
    // If we're closing the notification, set a timer to show it again after 5 seconds
    if (showNotification) {
      setTimeout(() => {
        setShowNotification(true);
      }, 5000); // 5000 milliseconds = 5 seconds
    }
  };

  // Show notification by default when component mounts
  useEffect(() => {
    setShowNotification(true);
  }, []);
  return (
  <div className="flex gap-[60px]">
    {/* Bell notification with toggle functionality */}
          {currentUser?.user?.isActive === false && currentUser?.user?.sbtRevoked === true && (
            <div className="relative block sm:hidden">
              <img 
                src={bell} 
                alt="" 
                className="w-[20px] h-[20px] mt-[10px]  cursor-pointer"
                onClick={toggleNotification}  
              />
              {showNotification && (
                <div className="absolute right-0 w-fit h-fit z-50 flex justify-center">
                  <div className="w-[300px] lg:w-[448px] h-fit bg-[#232323] justify-between rounded-[5px] lg:rounded-[10px] lg:p-[15px] flex items-center  border-[#FFFFFF33] border-[1px] p-[2px] gap-[5px] lg:gap-[10px]">
                    <div className="flex justify-between items-start mb-2"></div>
                    <p className="font-medium font-dmSans text-[10px] md:text-[12px] lg:text-[16px] text-white leading-[10px] md:leading-[14px] lg:leading-[24.41px] tracking-[-0.02em]">
                      Your account is currently inactive. Reclaim Your SBT now!
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        className="w-[98.86px] py-[5px] gap-[4.99px] rounded-[4.99px] border-[0.39px] px-[6.43px] text-[10.29px] leading-[15.69px] lg:w-[144px] lg:h-fit lg:rounded-[9.35px] lg:gap-[7.26px] bg-primary cursor-pointer text-black font-dmSans font-medium lg:text-[14px] lg:leading-[22px]"
                        onClick={() => (window.location.href = "/reclaim-sbt")}
                      >
                        Reclaim Your SBT
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
    <div className="block relative sm:hidden">
      {!currentUser?.user ? (
        // 1. Show "MEMBER LOGIN" if no user is logged in
        <div className="sm:hidden flex flex-col items-center gap-[5px]">
          <div className="flex gap-[2.96px] items-center">
            <img
              src={loginstar}
              alt=""
              className="h-[25.48px] w-[25.48px] lg:h-[43px] lg:w-[43px]"
            />
            <button className="text-black bg-white w-[112.56px] h-[25.85px] gap-[5.93px] rounded-[32px] px-[17.78px] py-[5.93px] lg:w-[190px] lg:h-[43px] lg:rounded-[54px] lg:px-[17.58px] lg:py-[10px] text-center font-dmSans font-normal text-[10.67px] leading-[13.89px] lg:text-[18px] lg:leading-[23.44px] tracking-[0%]">
              <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                MEMBER LOGIN
              </Link>
            </button>
          </div>
          <p className="text-sixty font-dmSans font-normal text-[8.3px] leading-[10.8px] lg:text-[14px] lg:leading-[18.23px] tracking-[-0.04em] text-center mt-[8px]">
            Already a member?
          </p>
        </div>
      ) : !currentUser?.user?.Refferal ? (
        // 2. Show "Enter Referral Code" if Referral is false
        <div>
          <Link
            to="/referral"
            className="text-black bg-white w-fit h-[25.85px] gap-[5.93px] rounded-[32px] px-[17.78px] py-[5.93px]  lg:h-[43px] lg:rounded-[54px] lg:px-[17.58px] lg:py-[10px] text-center font-dmSans font-normal text-[10.67px] leading-[13.89px] lg:text-[18px] lg:leading-[23.44px] tracking-[0%]"
          >
            Enter Referral Code
          </Link>
        </div>
      ) : currentUser?.user?.Refferal && !currentUser?.user?.minted ? (
        // 3. Show "Mint SBT" only if Referral is true and Minted is false
        <div>
          <Link
            to="/sbt-mint"
            className="text-black bg-white w-[112.56px] h-[25.85px] gap-[5.93px] rounded-[32px] px-[17.78px] py-[5.93px] lg:w-[190px] lg:h-[43px] lg:rounded-[54px] lg:px-[17.58px] lg:py-[10px] text-center font-dmSans font-normal text-[10.67px] leading-[13.89px] lg:text-[18px] lg:leading-[23.44px] tracking-[0%]"
          >
            Mint SBT
          </Link>
        </div>
      ) : (
        // 4. Show Menu if both Referral and Minted are true
        <>
          <button
            className="sm:hidden flex flex-col top-2 z-50 cursor-pointer absolute  right-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white mb-1.5 transition-transform duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white mb-1.5 transition-opacity duration-300 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </>
      )}
    </div>
    </div>
  );
};

export default MobileMenu;
