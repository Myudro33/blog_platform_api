import express from "express";
import {
  createComment,
  deleteComment,
  getPostComments,
  updateComment,
} from "../controllers/commentController.js";
import { auth } from "../middlewares/auth.js";
const router = express.Router();

router
  .route("/:id")
  .post(auth, createComment)
  .get(auth, getPostComments)
  .put(auth, updateComment)
  .delete(auth, deleteComment);

export default router;
