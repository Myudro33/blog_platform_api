import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "unauthorized" });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "unauthorized" });
    }
    req.user = decoded;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "only admin can access this route" });
};

export const isUser = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "only user can access this route" });
  }
  next();
};
export const isAuthor = async (req, res, next) => {
  const { baseUrl } = req;
  const { id } = req.params;
  const slicedUrl = baseUrl.slice(5);
  const record = await prisma[slicedUrl].findUnique({
    where: { id: parseInt(id) },
  });
  if (!record) {
    return res.status(404).json({ message: `${slicedUrl} not found` });
  }
  const authorId = slicedUrl == "comments" ? record.userId : record.authorId;
  if (req.user.role === "admin" || req.user.id == authorId) {
    return next();
  }
  return res.status(403).json({
    message: `only the author of the ${slicedUrl} can access this route`,
  });
};
