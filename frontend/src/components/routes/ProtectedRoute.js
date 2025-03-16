import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, accessType }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser?.user) {
      // Redirect to sign-in for protected routes only
      // if (accessType === "protected" || accessType === "referralOnly") {
      //   navigate("/signin", { replace: true });
      // }
      // return;
    }

    const { Refferal, minted, email, telegram, role, name, isActive } =
      currentUser.user;

    // Special case for reclaim-sbt page
    if (window.location.pathname === "/reclaim-sbt") {
      // If user is active, redirect away from reclaim-sbt
      if (isActive !== false) {
        navigate("/", { replace: true });
        return;
      }
      // Continue rendering for inactive users
      return;
    }

    // Allow access to /sbt-mint if referral is true and not minted
    if (window.location.pathname === "/sbt-mint") {
      if (Refferal && !minted) {
        // User should be able to access this page
        return;
      } else if (Refferal && minted) {
        // If already minted, redirect to success page
        navigate("/sbt-minted-Successfully", { replace: true });
        return;
      } else if (!Refferal) {
        // If no referral, redirect to referral page
        navigate("/referral", { replace: true });
        return;
      }
    }

    // Redirect to /sbt-mint if referral is true, not minted, and not already on that page
    if (Refferal && !minted && window.location.pathname !== "/sbt-mint") {
      navigate("/sbt-mint", { replace: true });
      return;
    }

    // Check if any required profile fields are missing
    const isProfileIncomplete = !email || !name || !telegram || !role;

    // Allow access to the dashboard page regardless of other conditions
    if (window.location.pathname === "/dashboard") {
      return;
    }

    // Allow access to the request-posted page
    if (window.location.pathname === "/request-posted") {
      return;
    }

    // Then handle incomplete profile cases
    if (Refferal && minted && isProfileIncomplete) {
      if (
        window.location.pathname !== "/sbt-minted-Successfully" &&
        window.location.pathname !== "/profile-details"
      ) {
        navigate("/profile-details", { replace: true });
      }
      return;
    }

    // Handle referral-only routes
    if (accessType === "referralOnly") {
      if (Refferal) {
        // If user already has referral, redirect to appropriate next step
        if (!minted) {
          navigate("/sbt-mint", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
      // If no referral, allow access to referral page
      return;
    }

    // Signin page is only accessible if not signed in
    if (accessType === "signin" && currentUser?.user) {
      navigate("/", { replace: true });
      return;
    }

    // Restrict access to protected routes if Refferal or minted conditions are not met
    if (
      accessType === "protected" &&
      !(Refferal && minted) &&
      window.location.pathname !== "/request-posted"
    ) {
      navigate("/", { replace: true });
    }
  }, [accessType, currentUser, navigate]);

  return children;
};

export default ProtectedRoute;
