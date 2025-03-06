import mongoose from "mongoose";


const helpRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  telegram: { type: String, required: true },
  walletAddress: { type: String, required: true },
  description: { type: String, required: true },
  urgency: { type: String, enum: ["Low", "Medium", "High"], required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const HelpRequest = mongoose.model("HelpRequest", helpRequestSchema);
export default HelpRequest;
