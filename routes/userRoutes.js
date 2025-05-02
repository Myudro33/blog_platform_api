import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  profile,
  updateUser,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";
import { auth, isAdmin, isUser } from "../middlewares/auth.js";
import { uploadProfile } from "../middlewares/uploadFile.js";

const router = express.Router();

router
  .route("/")
  .get(auth, isAdmin, getAllUsers)
  .post(auth, isAdmin, createUser);
router.route("/me").get(auth, isUser, profile);
router
  .route("/:id")
  .put(auth, uploadProfile.single("profileImage"), updateUser)
  .delete(auth, isAdmin, deleteUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
export default router;
