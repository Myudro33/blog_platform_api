import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      include: {
        roles: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, role_Id } = req.body;
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
    res.status(500).json({ message: "Error creating user" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role_Id } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const updatedUser = await prisma.users.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        password: hashedPassword,
        role_Id,
      },
    });
    delete updatedUser.password;
    res
      .status(200)
      .json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.users.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};

export const signUp = async (req, res) => {
  const { firstName, lastName, email, password, role_Id = 2 } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.users.create({
      data: { firstName, lastName, email, password: hashedPassword, role_Id },
    });
    res.json({ message: "user created", data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};
export const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.users.findUnique({
    where: { email: email },
    include: { roles: true },
  });
  if (!user) {
    return res.status(500).json({ message: "incorect credentials" });
  }
  const ispasswordValid = await bcrypt.compare(password, user.password);
  if (!ispasswordValid) {
    return res.status(401).json({ message: "wrong password" });
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
