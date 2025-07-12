import { Router } from "express";
import {
  registerUser,
  getProfile,
  updateProfile
} from "../controllers/userController.js";

const router = Router();

router.post("/", registerUser);
router.get("/:clerkId", getProfile);
router.put("/:clerkId", updateProfile);

export default router;
