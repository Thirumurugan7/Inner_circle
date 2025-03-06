import mongoose from "mongoose";

const pointsHistorySchema = new mongoose.Schema({
  points: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

const leaderboardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalPoints: { type: Number, default: 0 },
  pointsHistory: [pointsHistorySchema], // Stores all points with timestamps
  lastUpdated: { type: Date, default: Date.now },
  lastActivity:{
    type:String
  }
});

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
export default Leaderboard;
