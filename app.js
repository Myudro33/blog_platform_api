import express from "express";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "welcome to postgress" });
});
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
export default app;
