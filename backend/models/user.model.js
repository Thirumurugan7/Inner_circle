import mongoose from "mongoose";
const { Schema } = mongoose;

// Define default category contributions
const defaultCategoryContribution = {
  Networking: 0,
  "Public Speaking": 0,
  Feedback: 0,
  Collaboration: 0,
  Mentorship: 0,
  "Job Referrals": 0,
  Career: 0,
  Learning: 0,
  Others: 0,
};

const UserSchema = new Schema({
  name: {
    type: String,
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  sbtId: { type: Number,  default: 0 },
  totalPoints: { type: Number, default: 0 },
  monthlyPoints: { type: Number, default: 40 },
  pointsAllocated: { type: Number, default: 0 },
  pointsReceived: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  minted: { type: Boolean, default: false },
  lastReset: { type: Date, default: Date.now },
  topcontribution: { type: Number, default: 0 },
  categoryContribution: {
    type: Object,
    of: Number,
    default: defaultCategoryContribution,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: { type: String, default: "" },
  twitterId: { type: String, default: "" },
  github: { type: String, default: "" },
  website: { type: String, default: "" },
  telegram: { type: String, default: "" },
  Refferal: { type: Boolean, default: false },
});

const User = mongoose.model("User", UserSchema);
export default User;
