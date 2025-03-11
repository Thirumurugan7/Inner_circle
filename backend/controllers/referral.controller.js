// src/controllers/referral.controller.js
import User from "../models/user.model.js";
// src/controllers/referral.controller.js
export const validateReferralCode = async (req, res) => {
  const code = req.body.referralCode?.trim(); // Accessing from request body; // Optional chaining with trim
  console.log(code);
  try {
    const validReferralCodes = ["INNERCIRCLE@2025", "5202@ELCRICRENNI"]; // Example valid codes

    if (!code) {
      return res
        .status(400)
        .json({ success: false, message: "Referral code is required" });
    }

    if (validReferralCodes.includes(code)) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false, message: "Invalid referral code" });
    }
  } catch (error) {
    console.error("Referral code validation error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const referralStatusUpdate = async (req, res) => {
  const { walletAddress, referralCode, hasReferral } = req.body;

  try {
    // Log incoming request data for debugging
    console.log("Referral update request:", {
      walletAddress,
      referralCode,
      hasReferral,
    });

    // Check if the referral code matches the specific value INNERCIRCLE@2025
    const validReferralCode = "INNERCIRCLE@2025";
    const isValidReferralCode = referralCode === validReferralCode;

    if (referralCode && referralCode.trim() !== "") {
      console.log(`Referral code received: "${referralCode}"`);
      console.log(`Is valid: ${isValidReferralCode}`);
    } else {
      console.log("No referral code provided");
    }

    // Only set Refferal to true if both conditions are met:
    // 1. hasReferral flag is true (frontend thinks it has a valid code)
    // 2. The code matches our hardcoded value
    const shouldSetReferral = hasReferral === true && isValidReferralCode;

    // Update the user record
    const user = await User.findOneAndUpdate(
      { walletAddress },
      { Refferal: shouldSetReferral },
      { new: true }
    );

    if (user) {
      return res.json({
        success: true,
        message: shouldSetReferral
          ? "Referral code validated and applied successfully"
          : "Referral not applied: " +
            (referralCode === validReferralCode
              ? "Valid code but hasReferral flag is false"
              : "Invalid referral code"),
        referralValid: isValidReferralCode,
        user,
      });
    } else {
      console.log(`User with wallet address ${walletAddress} not found`);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating referral status:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};