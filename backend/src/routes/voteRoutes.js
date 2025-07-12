import { Router } from "express";
import { upvote, downvote } from "../controllers/voteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.post("/upvote", upvote);
router.post("/downvote", downvote);

export default router;
