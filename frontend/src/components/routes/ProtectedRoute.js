import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, accessType }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser?.user) {
      // Redirect to sign-in for protected routes only
      if (accessType === "protected") {
        navigate("/signin", { replace: true });
      }
      return;
    }

    const {
      Refferal,
      minted,
      email,
      twitterId,
      telegram,
      github,
      website,
      role,
    } = currentUser.user;

    // Automatically navigate to /sbt-mint if referral is true and not minted
    if (Refferal && !minted) {
      navigate("/sbt-mint", { replace: true });
      return;
    }

    // Check if any required profile fields are missing
    const isProfileIncomplete =
      !email || !twitterId || !telegram || !github || !website || !role;

    // Allow access only to update-profile if Refferal and minted are true but profile is incomplete
    if (Refferal && minted && isProfileIncomplete) {
      if (window.location.pathname !== "/update-profile") {
        navigate("/update-profile", { replace: true });
      }
      return;
    }

    // Restrict access to protected routes if Refferal or minted conditions are not met
    if (accessType === "protected" && !(Refferal && minted)) {
      navigate("/", { replace: true });
    }
  }, [accessType, currentUser, navigate]);

  return children;
};

export default ProtectedRoute;
