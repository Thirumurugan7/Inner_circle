import express from "express";
import { authenticateUser, getAllUsers, getUsersByWalletAddress, updateMintedStatus, updateUser } from "../controllers/auth.controller.js";


const router = express.Router();


router.post("/", authenticateUser);
router.get('/users', getAllUsers)
router.get("/getUsersByWalletAddress", getUsersByWalletAddress);
router.post('/minted', updateMintedStatus)
router.put("/user/update", updateUser);
export default router;