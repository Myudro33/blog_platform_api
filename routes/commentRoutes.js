import express from "express";
import {
  createComment,
  deleteComment,
  getPostComments,
  updateComment,
} from "../controllers/commentController.js";
import { auth, isAuthor } from "../middlewares/auth.js";
const router = express.Router();

router
  .route("/:id")
  .post(auth, createComment)
  .get(auth, getPostComments)
  .put(auth, isAuthor, updateComment)
  .delete(auth, isAuthor, deleteComment);

export default router;
