import express from "express";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import { handleError } from "./utils/errorHandler.js";
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "welcome to postgress" });
});
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use(handleError);
export default app;
