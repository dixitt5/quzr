import { Router } from "express";
import {
  createAnswer,
  updateAnswer,
  deleteAnswer,
  acceptAnswer
} from "../controllers/answerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);

router.post("/", createAnswer);
router.put("/:id", updateAnswer);
router.delete("/:id", deleteAnswer);
router.post("/:id/accept", acceptAnswer);

export default router;
