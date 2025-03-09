import cron from "node-cron";
import User from "./models/user.model.js";

// Run every minute (* * * * *)
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    // Get all users that need evaluation now
    // This query optimization avoids processing all users every minute
    const usersToEvaluate = await User.find({
      $or: [
        { nextScheduledUpdate: { $lte: now } },
        {
          nextScheduledUpdate: { $exists: false },
          lastReset: { $lte: new Date(now - 5 * 60 * 1000) }, // 5 minutes in milliseconds
        },
        {
          nextScheduledUpdate: { $exists: false },
          lastReset: { $exists: false },
          createdAt: { $lte: new Date(now - 5 * 60 * 1000) }, // 5 minutes in milliseconds
        },
      ],
    });

    console.log(
      `Running 5-minute evaluation for ${
        usersToEvaluate.length
      } eligible users at ${now.toISOString()}`
    );

    // Process each user
    let updatedCount = 0;
    let activatedCount = 0;
    let deactivatedCount = 0;

    for (const user of usersToEvaluate) {
      console.log(
        `Evaluating user ${user._id}: pointsAllocated=${user.pointsAllocated}, pointsReceived=${user.pointsReceived}`
      );

      // Store previous state for logging
      const wasActive = user.isActive;

      // Check activity criteria
      if (user.pointsAllocated < 25 || user.pointsReceived < 15) {
        user.isActive = false;
        if (wasActive) deactivatedCount++;
      } else {
        user.isActive = true;
        if (!wasActive) activatedCount++;
      }
      // Reset data for the next cycle
      user.monthlyPoints = 40;
      user.pointsAllocated = 0;
      user.pointsReceived = 0;

      // Set lastReset to now
      user.lastReset = new Date();

      // Calculate the next scheduled update time (5 minutes from now)
      user.nextScheduledUpdate = new Date(now.getTime() + 5 * 60 * 1000);

      await user.save();
      updatedCount++;

      console.log(
        `Updated user: ${user._id}, status: ${
          wasActive ? "active" : "inactive"
        } → ${user.isActive ? "active" : "inactive"}, ` +
          `next evaluation: ${user.nextScheduledUpdate.toISOString()}`
      );
    }
    console.log(
      `Evaluation summary: ${updatedCount} users processed, ${activatedCount} activated, ${deactivatedCount} deactivated`
    );
  } catch (error) {
    console.error("Error during 5-minute user evaluation:", error);
    // Consider adding notification for critical errors
  }
});

/**
 * For individual user evaluation outside the scheduled job
 * @param {string} userId - ID of the user to evaluate
 * @returns {Object} - Result of the evaluation
 */
export async function evaluateUserActivity(userId) {
  try {
    const now = new Date();
    const user = await User.findById(userId);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const previousStatus = user.isActive;

    // Check activity criteria
    if (user.pointsAllocated < 25 || user.pointsReceived < 15) {
      user.isActive = false;
    } else {
      user.isActive = true;
    }

    // Reset data
    user.monthlyPoints = 40;
    user.pointsAllocated = 0;
    user.pointsReceived = 0;
    user.lastReset = new Date();
    user.nextScheduledUpdate = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now

    await user.save();

    return {
      success: true,
      userId: user._id,
      previousStatus,
      currentStatus: user.isActive,
      nextEvaluation: user.nextScheduledUpdate,
    };
  } catch (error) {
    console.error(`Error evaluating user ${userId}:`, error);
    return { success: false, message: error.message };
  }
}
