import express from "express";
import {allocatePoints, getHelpActions, getHelpActionsByWalletAddress, getUserStats} from "../controllers/helpAction.controller.js";

const router = express.Router();

router.post("/allocatepoints", allocatePoints);
router.get('/gethelpactions', getHelpActions)
router.get('/gethelpactionByWallet', getHelpActionsByWalletAddress)
router.get('/pointandAllocation', getUserStats)
export default router;
