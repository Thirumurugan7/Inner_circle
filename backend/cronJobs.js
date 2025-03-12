import cron from "node-cron";
import User from "./models/user.model.js";
import { reinstateUserSBT, revokeUserSBT } from "./services/sbt.service.js";

// Run every minute for evaluation
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    // Get all users that need evaluation now
    const usersToEvaluate = await User.find({
      $or: [
        { nextScheduledUpdate: { $lte: now } },
        {
          nextScheduledUpdate: { $exists: false },
          lastReset: { $lte: new Date(now - 5 * 60 * 1000) },
        },
        {
          nextScheduledUpdate: { $exists: false },
          lastReset: { $exists: false },
          createdAt: { $lte: new Date(now - 5 * 60 * 1000) },
        },
      ],
    });

    console.log(
      `Running 5-minute evaluation for ${
        usersToEvaluate.length
      } eligible users at ${now.toISOString()}`
    );

    let updatedCount = 0;
    let activatedCount = 0;
    let deactivatedCount = 0;
    let sbtRevokedCount = 0;

    for (const user of usersToEvaluate) {
      console.log(
        `Evaluating user ${user._id}: pointsAllocated=${user.pointsAllocated}, pointsReceived=${user.pointsReceived}`
      );

      // Store previous state for logging
      const wasActive = user.isActive;

      // Check activity criteria
      if (user.pointsAllocated < 25 || user.pointsReceived < 15) {
        user.isActive = false;
        if (wasActive) {
          deactivatedCount++;

          // Revoke SBT if user has one
          if (user.minted && user.sbtId) {
            try {
              await revokeUserSBT(user.sbtId);
              user.sbtRevoked = true;
              sbtRevokedCount++;
              console.log(
                `SBT revoked for user ${user._id}, token ID: ${user.sbtId}`
              );
            } catch (error) {
              console.error(
                `Failed to revoke SBT for user ${user._id}:`,
                error
              );
            }
          }
        }
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
      `Evaluation summary: ${updatedCount} users processed, ${activatedCount} activated, ` +
        `${deactivatedCount} deactivated, ${sbtRevokedCount} SBTs revoked`
    );
  } catch (error) {
    console.error("Error during 5-minute user evaluation:", error);
  }
});
