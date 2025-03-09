import React, { useState, useEffect } from "react";
import loginstar from "../assets/images/loginstar.svg";
import Logo from "../uicomponents/Logo";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import profile from "../assets/images/profile.svg";
import ellipse from "../assets/images/ellipse.png";
import MobileMenu from "./headers/mobileMenu";
import DesktopMenu from "./headers/DesktopMenu";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function to reset body overflow when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Member Requests", path: "/member-requests" },
    { name: "Points Allocation", path: "/points-allocation" },
    { name: "Leaderboard", path: "/leaderboard" },
  ];
  const menu = [
    { name: "Community", path: "#community" },
    { name: "The Path", path: "#path" },
    { name: "Values", path: "#value" },
  ];
  const currentUser = useSelector((state) => state.user.currentUser);
  console.log(currentUser);

  return (
    <div className="relative flex w-full justify-between  py-[25.19px] lg:py-[40px] px-[23px] sm:px-[60px] lg:px-[80px]">
      <Logo />
      {currentUser && currentUser?.user && (
        <img src={ellipse} alt="" className="absolute top-0 right-0 -z-30" />
      )}
      {/* Hamburger menu button - only visible on mobile */}
      <MobileMenu
        toggleMenu={toggleMenu}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      {/* Mobile menu overlay - with fixed height and scrolling */}
      <div
        className={`sm:hidden fixed inset-0 bg-black bg-opacity-90 z-10 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{ height: "100vh" }}
      >
        <div className="flex flex-col items-center pt-20 pb-10 h-full overflow-y-auto">
          <div className="flex flex-col items-center gap-6 min-h-min">
            <div className="flex flex-col items-center gap-[10px] uppercase">
              {menuItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex gap-[12px] items-center cursor-pointer group transition-all duration-300 ${
                      isActive ? "text-white" : "text-sixty"
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={`w-[12px] h-[12px] border-[1px] transition-all duration-300 ${
                          isActive
                            ? "border-white bg-primary"
                            : "border-sixty group-hover:border-primary group-hover:bg-primary"
                        }`}
                      ></div>
                      <p className="font-dmSans font-light text-[18px] group-hover:text-primary leading-[23.44px] tracking-[0em] transition-all duration-300">
                        {item.name}
                      </p>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
            <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
              <button
                className="flex cursor-pointer items-center w-[114px] h-[40px] gap-[11px] rounded-[10px] bg-primary text-black px-[15px] py-[4px] font-dmSans font-medium text-[17.61px] leading-[31.45px]"
              >
                <img src={profile} alt="" className="w-[18px] h-[18px]" />
                Profile
              </button>
            </Link>
          </div>
          ;
        </div>
      </div>

      {/* Desktop menu - hidden on mobile */}
      <DesktopMenu />
    </div>
  );
};

export default Header;




