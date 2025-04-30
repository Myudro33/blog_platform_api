import express from "express";
import upload from "../middlewares/uploadFile.js";

const router = express.Router();

import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPostById,
} from "../controllers/postController.js";
import { auth } from "../middlewares/auth.js";

router.route("/").get(getPosts).post(auth, upload.single("image"), createPost);
router
  .route("/:id")
  .get(auth, getPostById)
  .put(auth, upload.single("image"), updatePost)
  .delete(auth, deletePost);

export default router;
