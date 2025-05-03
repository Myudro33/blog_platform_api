import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/errorHandler.js";

const prisma = new PrismaClient();

export const createComment = async (req, res, next) => {
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
    next(new AppError(error.message, 500));
  }
};

export const getPostComments = async (req, res, next) => {
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
            profileImage: true,
          },
        },
      },
    });
    res
      .status(200)
      .json({ message: "Comments fetched successfully", data: comments });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const updateComment = async (req, res, next) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const comment = await prisma.comments.findUnique({
      where: { id: parseInt(id) },
    });
    if (!comment) {
      return next(new AppError("Comment not found", 404));
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
    next(new AppError(error.message, 500));
  }
};

export const deleteComment = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const comment = await prisma.comments.findUnique({
      where: { id: parseInt(id) },
    });
    if (!comment) {
      return next(new AppError("Comment not found", 404));
    }
    await prisma.comments.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
