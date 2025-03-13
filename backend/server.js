import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/user.route.js";
import helpRequestRoutes from './routes/helpRequest.route.js'
import helpActionRoutes from './routes/helpAction.route.js'
import leaderboardRoutes from './routes/Leaderboard.route.js'
import referralRoutes from './routes/referral.route.js'

const app = express();
dotenv.config();
// Middleware
app.use(express.json());
app.use(cors());

// Connect to DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/helprequest", helpRequestRoutes);
app.use("/api/action", helpActionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/referral',referralRoutes)
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
