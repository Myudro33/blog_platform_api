import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const user = req.user;

  try {
    const comment = await prisma.comments.create({
      data: {
        postId: parseInt(id),
        content,
        userId: parseInt(user.id),
      },
    });
    res
      .status(201)
      .json({ message: "Comment created successfully", data: comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostComments = async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await prisma.comments.findMany({
      where: {
        postId: parseInt(id),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    res
      .status(200)
      .json({ message: "Comments fetched successfully", data: comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const user = req.user;
  try {
    const comment = await prisma.comments.findUnique({
      where: { id: parseInt(id) },
    });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (!(user.role == "admin" || user.id == comment.userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this comment" });
    }
    const updatedComment = await prisma.comments.update({
      where: {
        id: parseInt(id),
      },
      data: {
        content,
      },
    });
    res
      .status(200)
      .json({ message: "Comment updated successfully", data: updatedComment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const comment = await prisma.comments.findUnique({
      where: { id: parseInt(id) },
    });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (!(user.role == "admin" || user.id == comment.userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
    }
    await prisma.comments.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
