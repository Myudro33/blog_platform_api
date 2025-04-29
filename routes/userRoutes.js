import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  signIn,
  signUp,
  updateUser,
} from "../controllers/userController.js";
import { auth, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router
  .route("/")
  .get(auth, isAdmin, getAllUsers)
  .post(auth, isAdmin, createUser);
router
  .route("/:id")
  .put(auth, isAdmin, updateUser)
  .delete(auth, isAdmin, deleteUser);
router.route("/signup").post(signUp);
router.route("/signIn").post(signIn);
export default router;
