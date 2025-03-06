
import cron from "node-cron";
import User from "./models/user.model.js";

// Run once per day at midnight (0 0 * * *)
cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();
    
    // Get all users
    const allUsers = await User.find();
    console.log(`Running daily check for ${allUsers.length} users at ${now.toISOString()}`);
    
    // Process each user
    let updatedCount = 0;
    
    for (const user of allUsers) {
      // Check if this user is due for a 30-day evaluation
      const shouldUpdate = shouldUpdateUser(user, now);
      
      if (shouldUpdate) {
        console.log(`User ${user._id} is due for 30-day evaluation`);
        
        // Check activity criteria
        if (user.pointsAllocated < 25 || user.pointsReceived < 15) {
          user.isActive = false;
          console.log(`User ${user._id} marked as inactive due to insufficient activity`);
        } else {
          user.isActive = true;
          console.log(`User ${user._id} maintained active status`);
        }

        // Reset data
        user.monthlyPoints = 40;
        user.pointsAllocated = 0;
        user.pointsReceived = 0;
        
        // Set lastReset to now with a new Date object
        user.lastReset = new Date();
        
        // Calculate the next scheduled update time (30 days from now)
        user.nextScheduledUpdate = getNextUpdateTime(now);
        
        await user.save();
        updatedCount++;
        
        console.log(`Updated user: ${user._id}, next evaluation scheduled for: ${user.nextScheduledUpdate.toISOString()}`);
      }
    }

    if (updatedCount > 0) {
      console.log(`Updated ${updatedCount} users in this run.`);
    } else {
      console.log("No users were due for evaluation today.");
    }
  } catch (error) {
    console.error("Error during daily user evaluation:", error);
  }
});

/**
 * Determines if a user should be updated based on their 30-day cycle
 * @param {Object} user - User document from MongoDB
 * @param {Date} currentTime - Current timestamp
 * @returns {boolean} - Whether the user should be updated
 */
function shouldUpdateUser(user, currentTime) {
  // If the user has a nextScheduledUpdate field, use that as the primary check
  if (user.nextScheduledUpdate) {
    return currentTime >= user.nextScheduledUpdate;
  }
  
  // For users with lastReset but no nextScheduledUpdate (legacy users)
  if (user.lastReset) {
    // Check if it's been at least 30 days since the last reset
    const timeSinceLastReset = currentTime - user.lastReset;
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    return timeSinceLastReset >= thirtyDaysInMs;
  }
  
  // For new users with no reset history, check if it's been 30 days since creation
  if (user.createdAt) {
    const timeSinceCreation = currentTime - user.createdAt;
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    return timeSinceCreation >= thirtyDaysInMs;
  }
  
  // If we can't determine based on the above, default to true to be safe
  return true;
}

/**
 * Calculate the next update time (30 days from now)
 * @param {Date} currentTime - Current timestamp
 * @returns {Date} - Next scheduled update time
 */
function getNextUpdateTime(currentTime) {
  const nextTime = new Date(currentTime);
  nextTime.setDate(nextTime.getDate() + 30); // Add 30 days
  return nextTime;
}