import { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma";
import ApiError from "../utils/error";
import { hashSync } from "bcryptjs";
import { createUserSchema, updateUserSchema } from "../validation";

export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        transactions: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      message: "Users fetched successfully",
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, username, password, role } = createUserSchema.parse(req.body);

    const exist = await prisma.user.findUnique({
      where: {
        username: username.toLowerCase(),
      },
    });

    if (exist) {
      throw new ApiError("Username already in use", 409);
    }

    const hash = hashSync(password);

    const user = await prisma.user.create({
      data: {
        name: name,
        username: username.toLowerCase(),
        password: hash,
        role,
      },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        transactions: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const { name, username, password, role } = updateUserSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    if (username && username.toLowerCase() !== user.username.toLowerCase()) {
      const existingUsername = await prisma.user.findUnique({
        where: {
          username: username.toLowerCase(),
        },
      });

      if (existingUsername && existingUsername.id !== id) {
        throw new ApiError("Username already in use", 409);
      }
    }

    let updatedPassword: string | undefined;

    if (password) {
      updatedPassword = hashSync(password);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: name ?? undefined,
        username: username ? username.toLowerCase() : undefined,
        password: updatedPassword,
        role: role ?? undefined,
      },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        transactions: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        transactions: true,
      },
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (id === req.user?.id) {
      throw new ApiError("You cannot delete your own account", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
