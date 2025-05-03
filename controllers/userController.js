import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/emailService.js";
import { AppError } from "../utils/errorHandler.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.users.findMany({
      include: {
        roles: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const createUser = async (req, res, next) => {
  const { name, email, password, role_Id = 2 } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role_Id,
      },
    });
    delete newUser.password;
    res
      .status(201)
      .json({ message: "User created successfully", data: newUser });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const file = req.file;
  try {
    let updatedUser = await prisma.users.update({
      where: { id: parseInt(id) },
      data: {
        name,
      },
    });
    if (file) {
      updatedUser = await prisma.users.update({
        where: { id: parseInt(id) },
        data: {
          profileImage: file.path,
        },
      });
    }
    delete updatedUser.password;
    res
      .status(200)
      .json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.users.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const signUp = async (req, res, next) => {
  const { name, email, password, role_Id = 2 } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.users.create({
      data: { name, email, password: hashedPassword, role_Id },
    });
    delete user.password;
    res.json({ message: "user created", data: user });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await prisma.users.findUnique({
    where: { email: email },
    include: { roles: true },
  });
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const ispasswordValid = await bcrypt.compare(password, user.password);
  if (!ispasswordValid) {
    return next(new AppError("Invalid password", 401));
  }
  const token = jwt.sign(
    { id: user.id, role: user.roles.name },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  delete user.password;
  res.json({ message: "login success", token: token, data: user });
};

export const profile = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(new AppError("Unauthorized", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      include: { roles: true },
    });
    if (!user) {
      return next(new AppError("User not found", 401));
    }
    delete user.password;
    res.json({ data: user });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await prisma.users.findUnique({
    where: { email: email },
  });
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  await prisma.otpCodes.create({
    data: {
      userId: user.id,
      code: otpCode,
      expiry: otpExpiry,
    },
  });
  try {
    const isEmailSent = await sendMail(
      email,
      "Password Reset OTP",
      `<h1>Password Reset OTP Code</h1>
        <p>You requested a password reset. Use the following OTP code to reset your password:</p>
        <h2 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px; text-align: center;">${otpCode}</h2>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>`
    );
    if (isEmailSent) {
      await prisma.users.update({
        where: { id: user.id },
        data: {
          attempt: 0,
        },
      });
      res.json({ message: "OTP sent to email" });
    } else {
      next(new AppError("Failed to send email", 500));
    }
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const resetPassword = async (req, res, next) => {
  const { email, otpCode, newPassword } = req.body;
  try {
    const user = await prisma.users.findUnique({
      where: { email: email },
      include: { otpCodes: true },
    });
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    if (user.attempt == 5) {
      await prisma.otpCodes.deleteMany({
        where: { userId: user.id },
      });
      return next(
        new AppError("You have exceeded the maximum number of attempts", 403)
      );
    }
    if (user?.otpCodes[0]?.code != otpCode) {
      await prisma.users.update({
        where: { id: user.id },
        data: {
          attempt: user.attempt + 1,
        },
      });
      return next(new AppError("Invalid OTP code", 401));
    }
    const currentTime = new Date();
    if (user.otpCodes[0].expiry < currentTime) {
      return next(new AppError("OTP code has expired", 401));
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: { password: hashedPassword, attempt: 0 },
    });
    await prisma.otpCodes.deleteMany({
      where: { userId: user.id },
    });
    delete updatedUser.password;
    res.json({ message: "password updated successfully", data: updatedUser });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
