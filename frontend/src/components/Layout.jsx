import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import borderleftne from "../assets/images/borderleftne.png";
import borderrightne from "../assets/images/borderrightne.png";
import MiniFooter from "../uicomponents/MiniFooter";
import negrid from "../assets/images/negrid.svg";
import noise from "../assets/images/noise.png";
import { useSelector } from "react-redux";

const Layout = () => {
  const location = useLocation();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [showPopup, setShowPopup] = useState(true);

  const hideHeaderRoutes = [
    "/signin",
    "/signup",
    "/sbt-mint",
    "/referral",
    "/predefined-help-request",
    "/sbt-minted-Successfully",
    "/reclaim-sbt",
  ];

  const miniFooterRoutes = [
    "/signin",
    "/signup",
    "/sbt-mint",
    "/referral",
    "/predefined-help-request",
    "/",
    "/request-posted",
    "/regular-request-posted",
    "/sbt-minted-Successfully",
  ];

  const noiseBgRoutes = ["/", "/referral", "/signin"]; // Routes with noise background

  // Routes where popup should be shown
  const popupRoutes = [
    "/home",
    "/dashboard",
    "/points-allocation",
    "/leaderboard",
    "/member-requests",
  ];

  const isHomePage = location.pathname === "/";
  const showNoiseBg = noiseBgRoutes.includes(location.pathname);

  // Check if popup should be shown
  const shouldShowPopup =
    showPopup &&
    popupRoutes.some((route) => location.pathname === route) &&
    currentUser?.user?.isActive === false &&
    currentUser?.user?.sbtRevoked === true;

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Force document and body to be scrollable
  useEffect(() => {
    // Set essential scrolling styles
    document.documentElement.style.height = "100%";
    document.documentElement.style.overflow = "auto";
    document.body.style.height = "100%";
    document.body.style.overflow = "auto";

    // Clean up
    return () => {
      document.documentElement.style.height = "";
      document.documentElement.style.overflow = "";
      document.body.style.height = "";
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className={`min-h-screen flex flex-col ${showNoiseBg ? "hero" : ""}`}>
      {/* Border Images as fixed elements */}
      {!isHomePage && (
        <>
          <img
            src={borderleftne}
            alt="Left Border"
            className="fixed left-0 top-0 h-full hidden sm:block sm:w-[40px] lg:w-auto pointer-events-none"
            style={{ objectFit: "cover", width: "auto" }}
          />
          <img
            src={borderrightne}
            alt="Right Border"
            className="fixed right-0 top-0 h-full hidden sm:block sm:w-[40px] pointer-events-none mr-2 lg:mr-5"
            style={{ objectFit: "cover", width: "auto" }}
          />
        </>
      )}

      {/* Header */}
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}

     

      {/* Main Content with proper scrolling */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      {!miniFooterRoutes.includes(location.pathname) && <MiniFooter />}
    </div>
  );
};

export default Layout;
