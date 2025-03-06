import jwt from "jsonwebtoken";
import HelpRequest from "../models/helpRequest.model.js";
import User from "../models/user.model.js";


export const createHelpRequest = async (req, res) => {
  try {
   
    const token = req.header("Authorization")?.split(" ")[1];
    console.log("Received Token:", token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

  
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      const decodedWithoutVerification = jwt.decode(token);
      console.log("Decoded Token:", decodedWithoutVerification);

    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }


    const { id: userId, walletAddress } = decoded;
    const { telegram, description, urgency, category } = req.body;

    if (!urgency) {
      return res.status(400).json({ message: "Urgency is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.walletAddress !== walletAddress) {
      return res
        .status(403)
        .json({ message: "Wallet address mismatch. Unauthorized request." });
    }

 
    const newHelpRequest = new HelpRequest({
      user: userId,
      walletAddress,
      telegram,
      description,
      urgency,
      category,
    });


    await newHelpRequest.save();

    return res.status(201).json({
      message: "Help request created successfully",
      helpRequest: newHelpRequest,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};


export const getFewHelpRequests = async (req, res) => {
  try {
    const helpRequests = await HelpRequest.find()
      .populate("user", "name") // Fetch only 'name' from user
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order (newest first)
      .limit(6); // Limit the result to first 6

    return res
      .status(200)
      .json({ message: "Help requests retrieved successfully", helpRequests });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};


export const getAllHelpRequests = async (req, res) => {
  try {
    const helpRequests = await HelpRequest.find()
      .populate("user", "name  walletAddress") // Only fetches 'name'
      .sort({ createdAt: -1 })
       // Sorts by createdAt in descending order (newest first)

    return res
      .status(200)
      .json({ message: "Help requests retrieved successfully", helpRequests });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
