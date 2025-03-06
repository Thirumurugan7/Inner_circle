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
  const { walletAddress } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { walletAddress },
      { Refferal: true },
      { new: true } // The 'new' option returns the updated document
    );

    if (user) {
      return res.json({
        success: true,
        message: "Referral updated successfully",
        user, // Send the updated user data
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating referral status:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
