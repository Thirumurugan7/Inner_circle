import express from "express";
import {allocatePoints, getHelpActions, getHelpActionsByWalletAddress, getUserStats,Aatest, reclaimSBT} from "../controllers/helpAction.controller.js";

const router = express.Router();

router.post("/allocatepoints", allocatePoints);
router.get('/gethelpactions', getHelpActions)
router.get('/gethelpactionByWallet', getHelpActionsByWalletAddress)
router.get('/pointandAllocation', getUserStats)
router.post('/minting',Aatest)
router.post("/users/reclaim-sbt", reclaimSBT);
export default router;
