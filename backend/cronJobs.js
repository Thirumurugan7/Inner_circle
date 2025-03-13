import cron from "node-cron";
import User from "./models/user.model.js";



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
          lastReset: { $lte: new Date(now - 30 * 24 * 60 * 60 * 1000) },
        },
        {
          nextScheduledUpdate: { $exists: false },
          lastReset: { $exists: false },
          createdAt: { $lte: new Date(now - 30 * 24 * 60 * 60 * 1000) },
        },
      ],
    });

    console.log(
      `Running 30-days evaluation for ${
        usersToEvaluate.length
      } eligible users at ${now.toISOString()}`
    );

    let updatedCount = 0;
    let activatedCount = 0;
    let deactivatedCount = 0;
    let sbtRevokedCount = 0;
    let sbtRestoredCount = 0;

    for (const user of usersToEvaluate) {
      console.log(
        `Evaluating user ${user._id}: pointsAllocated=${user.pointsAllocated}, pointsReceived=${user.pointsReceived}`
      );

      // Store previous state for logging
      const wasActive = user.isActive;
      const wasSbtRevoked = user.sbtRevoked;

      // Check activity criteria
      if (user.pointsAllocated < 25 || user.pointsReceived < 15) {
        user.isActive = false;
        
        // Always set sbtRevoked to true for inactive users with minted SBTs
        // regardless of previous state
        if (user.minted && user.sbtId) {
          user.sbtRevoked = true;
          
          if (!wasSbtRevoked) {
            sbtRevokedCount++;
            console.log(
              `SBT marked as revoked for user ${user._id}, token ID: ${user.sbtId}`
            );
          }
        }
        
        if (wasActive) {
          deactivatedCount++;
          console.log(`User ${user._id} deactivated due to insufficient points`);
        }
      } else {
        // User meets activity criteria
        user.isActive = true;
        
        // If user becomes active and had a revoked SBT, restore it
        if (user.minted && user.sbtId && user.sbtRevoked) {
          user.sbtRevoked = false;
          sbtRestoredCount++;
          console.log(
            `SBT restored for user ${user._id}, token ID: ${user.sbtId}`
          );
        }
        
        if (!wasActive) {
          activatedCount++;
          console.log(`User ${user._id} activated due to sufficient points`);
        }
      }

      // Reset data for the next cycle
      user.monthlyPoints = 40;
      user.pointsAllocated = 0;
      user.pointsReceived = 0;

      // Set lastReset to now
      user.lastReset = new Date();

      // Calculate the next scheduled update time (2 minutes from now)
      user.nextScheduledUpdate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      await user.save();
      updatedCount++;

      console.log(
        `Updated user: ${user._id}, status: ${
          wasActive ? "active" : "inactive"
        } → ${user.isActive ? "active" : "inactive"}, ` +
          `SBT status: ${wasSbtRevoked ? "revoked" : "valid"} → ${
            user.sbtRevoked ? "revoked" : "valid"
          }, ` +
          `next evaluation: ${user.nextScheduledUpdate.toISOString()}`
      );
    }

    console.log(
      `Evaluation summary: ${updatedCount} users processed, ${activatedCount} activated, ` +
        `${deactivatedCount} deactivated, ${sbtRevokedCount} SBTs revoked, ${sbtRestoredCount} SBTs restored`
    );
  } catch (error) {
    console.error("Error during 30-days user evaluation:", error);
  }
});
