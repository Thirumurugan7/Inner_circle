import mongoose from "mongoose";
import User from "./user.model.js";

const helpActionSchema = new mongoose.Schema({
  helpedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  helpedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pointsAllocated: { type: Number, min: 1, max: 5, required: true },
  feedback: { type: String, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const HelpAction = mongoose.model("HelpAction", helpActionSchema);
export default HelpAction;
