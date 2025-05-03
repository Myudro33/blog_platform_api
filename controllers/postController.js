import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

export const getPosts = async (req, res) => {
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
    return res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
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
    return res.status(500).json({ message: error.message });
  }
};
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const { title, content } = req.body;
  const files = req.files;
  try {
    const post = await prisma.posts.findUnique({
      where: { id: parseInt(id) },
    });
    if (!(req.user.role == "admin" || user.id == post.authorId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this post" });
    }
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
      res.status(400).json({ message: "no files uploaded" });
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
    return res.status(500).json({ message: error.message });
  }
};
export const deletePost = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  try {
    const post = await prisma.posts.findUnique({
      where: { id: parseInt(id) },
    });
    if (!(user.role == "admin") && user.id != post.authorId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }
    await prisma.posts.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPostById = async (req, res) => {
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
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post fetched succesfully", data: post });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
