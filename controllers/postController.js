import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { AppError } from "../utils/errorHandler.js";

const prisma = new PrismaClient();

export const getPosts = async (req, res, next) => {
  try {
    const posts = await prisma.posts.findMany({
      include: {
        author: {
          select: { id: true, name: true, email: true, profileImage: true },
        },
        images: { select: { id: true, url: true } },
      },
    });
    res.json({ message: "Posts fetched successfully", data: posts });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export const createPost = async (req, res, next) => {
  const { title, content } = req.body;
  const files = req.files;
  const user = req.user;
  try {
    let newPost = await prisma.posts.create({
      data: { title, content, authorId: user.id },
    });
    if (files && files.length > 0) {
      const images = files.map((file) => ({
        created_at: new Date(),
        postId: newPost.id,
        url: file.path,
      }));
      await prisma.postImages.createMany({
        data: images,
      });
    }
    res.json({ message: "Post created successfully", data: newPost });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
export const updatePost = async (req, res, next) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const files = req.files;
  try {
    let updatedPost = await prisma.posts.update({
      where: { id: parseInt(id) },
      data: { title, content, updatedAt: new Date() },
    });
    if (files && files.length > 0) {
      files.forEach((file) => {
        if (fs.existsSync(`./${file.path}`)) {
          fs.unlinkSync(`./${file.path}`);
        }
      });
    }
    if (!files && !files.length > 0) {
      return next(new AppError("No files uploaded", 400));
    }
    const images = files.map((file) => ({
      created_at: new Date(),
      postId: updatedPost.id,
      url: file.path,
    }));
    await prisma.postImages.createMany({
      data: images,
    });
    res.json({ message: "Posts updated successfully", data: updatedPost });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
export const deletePost = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await prisma.posts.findUnique({
      where: { id: parseInt(id) },
    });
    if (!post) {
      return next(new AppError("Post not found", 404));
    }
    await prisma.posts.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export const getPostById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await prisma.posts.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: { id: true, name: true, email: true, profileImage: true },
        },
        images: { select: { id: true, url: true } },
        comments: true,
      },
    });
    if (!post) {
      return next(new AppError("Post not found", 404));
    }
    res.json({ message: "Post fetched succesfully", data: post });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
