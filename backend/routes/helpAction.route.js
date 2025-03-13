import express from "express";
import {allocatePoints, getHelpActions, getHelpActionsByWalletAddress, getUserStats,reclaimSBT, sbtmint} from "../controllers/helpAction.controller.js";

const router = express.Router();

router.post("/allocatepoints", allocatePoints);
router.get('/gethelpactions', getHelpActions)
router.get('/gethelpactionByWallet', getHelpActionsByWalletAddress)
router.get('/pointandAllocation', getUserStats)
router.post('/minting',sbtmint)
router.post("/users/reclaim-sbt", reclaimSBT);
export default router;
