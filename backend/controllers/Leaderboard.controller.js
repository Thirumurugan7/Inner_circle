import Leaderboard from "../models/leaderboard.model.js";
import moment from "moment";

export const getTopContributors = async (filter = "all-time") => {
  try {
    let dateFilter = {};

    // Define date range for monthly or weekly filter
    if (filter === "monthly") {
      dateFilter = {
        $gte: moment().subtract(1, "month").startOf("day").toDate(),
      };
    } else if (filter === "weekly") {
      dateFilter = {
        $gte: moment().subtract(1, "week").startOf("day").toDate(),
      };
    }

    const matchStage =
      filter === "all-time" ? {} : { "pointsHistory.date": dateFilter };

    const topContributors = await Leaderboard.aggregate([
      { $unwind: "$pointsHistory" },
      { $match: matchStage },
      {
        $group: {
          _id: "$user",
          totalPoints: { $sum: "$pointsHistory.points" },
          lastUpdated: { $last: "$lastUpdated" },
          lastActivity: { $last: "$lastActivity" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      { $sort: { totalPoints: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          name: "$userDetails.name",
          email: "$userDetails.email",
          points: "$totalPoints",
          lastUpdated: 1,
          lastActivity: 1,
          telegram: "$userDetails.telegram",
        },
      },
    ]);

    return topContributors;
  } catch (error) {
    console.error("Error fetching top contributors:", error);
    return [];
  }
};
