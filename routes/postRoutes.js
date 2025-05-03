import express from "express";
import {
  uploadProductImages,
  uploadProfile,
} from "../middlewares/uploadFile.js";

const router = express.Router();

import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPostById,
} from "../controllers/postController.js";
import { auth, isAuthor } from "../middlewares/auth.js";

router
  .route("/")
  .get(getPosts)
  .post(auth, uploadProductImages.array("image", 5), createPost);
router
  .route("/:id")
  .get(auth, getPostById)
  .put(auth, isAuthor, uploadProductImages.array("image", 5), updatePost)
  .delete(auth, deletePost);

export default router;
