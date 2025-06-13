import express from "express";
import {reclaimSBT, sbtmint} from "../controllers/helpAction.controller.js";
import { sbtmint as sbtmintBNB, reclaimSBT as reclaimSBTBNB } from "../controllers/bnbPoints.controller.js";


const router = express.Router();

router.post('/setPoints',sbtmint)
router.get("/getPoints", reclaimSBT);
router.post('/setPointsBNB',sbtmintBNB)
router.get("/getPointsBNB", reclaimSBTBNB);

export default router;
