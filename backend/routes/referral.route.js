// src/routes/referral.routes.js
import express from "express";
import { referralStatusUpdate, validateReferralCode } from "../controllers/referral.controller.js";

const router = express.Router();

router.post("/validate-referral", validateReferralCode);
router.post('/update-referral',referralStatusUpdate)

export default router;
