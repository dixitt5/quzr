import { Router } from "express";
import {
  createTag,
  getAllTags,
  searchTags,
  updateTag
} from "../controllers/tagController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Middleware to check for Admin role
const admin = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

router.get("/", getAllTags);
router.get("/search", searchTags);

// Protected Admin Routes
router.post("/", protect, admin, createTag);
router.put("/:id", protect, admin, updateTag);

export default router;
