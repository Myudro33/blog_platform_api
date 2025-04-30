import app from "./app.js";
import dotenv from "dotenv";
import express from "express";
import swaggerUI from "swagger-ui-express";
import specs from "./models/swagger.js";
dotenv.config();
app.use("/uploads", express.static("./uploads"));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.listen(3000, () => {
  console.log("server is running on", 3000);
});
