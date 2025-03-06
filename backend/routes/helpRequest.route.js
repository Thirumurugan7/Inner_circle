import express from "express";
import {
  createHelpRequest,
  getAllHelpRequests,
  getFewHelpRequests,
} from "../controllers/helpRequest.controller.js";

const router = express.Router();

router.post("/", createHelpRequest); // API to post help request
router.get("/allrequest", getAllHelpRequests);
router.get("/fewhelprequest", getFewHelpRequests);
export default router;
