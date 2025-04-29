import app from "./app.js";
import dotenv from "dotenv";
import express from "express";
dotenv.config();
app.use("/uploads", express.static("./uploads"));
app.listen(3000, () => {
  console.log("server is running on", 3000);
});
