import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Form from "../models/form.model.js";
// Set your JWT secret key (store in .env file in production)
const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateUser = async (req, res) => {
  try {
    const { name, walletAddress, email } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Wallet address is required",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ walletAddress });
    let isNewUser = false;

    if (!user) {
      const form = await Form.findOne({ email });

      if (form) {
        // Create a new user with form data if a matching form is found
        user = new User({
          walletAddress,
          email,
          name: form.name,
          role: form.role,
          twitterId: form.twitterId,
          github: form.github,
          website: form.website,
          telegram: form.telegram,
        });
      } else {
        // Create a new user with only walletAddress and email if no form is found
        user = new User({ walletAddress, email , name});
      }
      await user.save();
      isNewUser = true;
    }

    // Generate JWT token
const token = jwt.sign(
  { id: user._id, walletAddress: user.walletAddress },
  process.env.JWT_SECRET
);

    // Send full user data in the response
    return res.status(isNewUser ? 201 : 200).json({
      success: true,
      message: isNewUser
        ? "User successfully registered"
        : "User successfully authenticated",
      token,
      user, // Sending the entire user object
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during authentication",
      error: error.message,
    });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users where Refferal and minted are true
    const users = await User.find({ Refferal: true, minted: true });

    // Check if there are no users in the database
    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "No users found with Refferal and minted as true",
      });
    }

    // Send the users data in the response
    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching users",
      error: error.message,
    });
  }
};


export const getUsersByWalletAddress = async (req, res) => {
  try {
    const { walletAddress } = req.query; // Get walletAddress from query parameters

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Wallet address is required",
      });
    }

    // Find users with the given walletAddress
    const users = await User.find({ walletAddress });

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "No users found with this wallet address",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    console.error("Error retrieving users by wallet address:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching users",
      error: error.message,
    });
  }
};





export const updateMintedStatus = async (req, res) => {
  try {
    const { walletAddress, sbtId } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    // Verify the JWT token
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (!walletAddress) {
      return res.status(400).json({ message: "Wallet address is required" });
    }

    // Find and update the user's minted status
    const user = await User.findOneAndUpdate(
      { walletAddress },
      { minted: true, sbtId }, // Update minted status and sbtId
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

      return res.status(200).json({
        success: true,
        message: "Minted status updated",
        user,
      });
  } catch (error) {
    console.error("Error updating minted status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




export const updateUser = async (req, res) => {
  try {
    const { name, role, twitterId, github, website, telegram } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    let decoded;
    try {
      // Use synchronous verification instead of callback
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (verificationError) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Extract the walletAddress from the decoded token
    const { walletAddress } = decoded;
    if (!walletAddress) {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    // Prepare the fields to be updated
    const updateFields = {};
    if (name) updateFields.name = name;
    if (role) updateFields.role = role;
    if (twitterId) updateFields.twitterId = twitterId;
    if (github) updateFields.github = github;
    if (website) updateFields.website = website;
    if (telegram) updateFields.telegram = telegram;

    // Update the user with the provided fields
    const updatedUser = await User.findOneAndUpdate(
      { walletAddress },
      { $set: updateFields },
      { new: true, projection: { password: 0 } } // Exclude password from response
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};