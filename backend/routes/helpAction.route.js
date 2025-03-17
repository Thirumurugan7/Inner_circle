import express from "express";
import {reclaimSBT, sbtmint} from "../controllers/helpAction.controller.js";

const router = express.Router();

router.post('/setPoints',sbtmint)
router.get("/getPoints", reclaimSBT);
export default router;
