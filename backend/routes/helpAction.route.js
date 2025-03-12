import express from "express";
import {allocatePoints, getHelpActions, getHelpActionsByWalletAddress, getUserStats,Aatest} from "../controllers/helpAction.controller.js";

const router = express.Router();

router.post("/allocatepoints", allocatePoints);
router.get('/gethelpactions', getHelpActions)
router.get('/gethelpactionByWallet', getHelpActionsByWalletAddress)
router.get('/pointandAllocation', getUserStats)
router.post('/minting',Aatest)
export default router;
