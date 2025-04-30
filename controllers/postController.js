import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.posts.findMany({
      include: {
        comments: true,
        author: { select: { id: true, name: true, email: true, image: true } },
      },
    });
    res.json({ message: "success", data: posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const { title, content } = req.body;
  const file = req.file;
  const user = req.user;
  try {
    let newPost = await prisma.posts.create({
      data: { title, content, authorId: user.id },
    });
    if (file) {
      newPost = await prisma.posts.update({
        where: { id: newPost.id },
        data: {
          image: file.path,
        },
      });
    }
    res.json({ message: "success", data: newPost });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const { title, content } = req.body;
  const file = req.file;
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
    if (file) {
      updatedPost = await prisma.posts.update({
        where: { id: parseInt(id) },
        data: {
          image: file.path,
        },
      });
    }
    res.json({ message: "success", data: updatedPost });
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
    res.json({ message: "success" });
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
        comments: true,
        author: { select: { id: true, name: true, email: true, image: true } },
      },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "success", data: post });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
