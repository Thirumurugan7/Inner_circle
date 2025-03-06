
import express from "express";
import { getTopContributors } from "../controllers/Leaderboard.controller.js";

const router = express.Router();

router.get("/top-contributors", async (req, res) => {
  try {
    const { filter } = req.query; // Get filter from query params (all-time, monthly, weekly)
    const contributors = await getTopContributors(filter || "all-time");
    res.status(200).json(contributors);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;
