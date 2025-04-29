import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  profile,
  updateUser,
} from "../controllers/userController.js";
import { auth, isAdmin, isUser } from "../middlewares/auth.js";
import upload from "../middlewares/uploadFile.js";

const router = express.Router();

router
  .route("/")
  .get(auth, isAdmin, getAllUsers)
  .post(auth, isAdmin, createUser);
router.route("/me").get(auth, isUser, profile);
router
  .route("/:id")
  .put(auth, upload.single("profileImage"), updateUser)
  .delete(auth, isAdmin, deleteUser);
export default router;
