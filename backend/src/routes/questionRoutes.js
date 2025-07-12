import { Router } from "express";
import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion
} from "../controllers/questionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, createQuestion);
router.get("/", getAllQuestions);
router.get("/:id", getQuestionById);
router.put("/:id", protect, updateQuestion);
router.delete("/:id", protect, deleteQuestion);

export default router;
