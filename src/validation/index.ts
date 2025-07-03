import { TransactionType, UserRole } from "@prisma/client";
import * as zod from "zod";

export const registerSchema = zod.object({
  name: zod
    .string({
      required_error: "Name must be not empty",
    })
    .min(3, {
      message: "Name must be at least 3 characters long",
    })
    .max(50, {
      message: "Name must not be more than 50 characters long",
    }),
  username: zod
    .string({
      required_error: "Username must not be empty",
    })
    .min(3, {
      message: "Username must be at least 3 characters long",
    })
    .max(50, {
      message: "Username must not be more than 50 characters long",
    }),
  password: zod
    .string({
      required_error: "Password must not be empty",
    })
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(30, {
      message: "Password must not be more than 30 characters long",
    })
    .regex(/^[A-Za-z0-9@#!$%^&*]*$/, {
      message:
        "Password can only contain letters, numbers, and special characters (@#!$%^&*)",
    })
    .regex(/^\S*$/, {
      message: "Password must not contain spaces",
    }),
});

export const loginSchema = zod.object({
  username: zod
    .string({
      required_error: "Username must not be empty",
    })
    .min(3, {
      message: "Username must be at least 3 characters long",
    })
    .max(50, {
      message: "Username must not be more than 50 characters long",
    }),
  password: zod
    .string({
      required_error: "Password must not be empty",
    })
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(30, {
      message: "Password must not be more than 30 characters long",
    })
    .regex(/^[A-Za-z0-9@#!$%^&*]*$/, {
      message:
        "Password can only contain letters, numbers, and special characters (@#!$%^&*)",
    })
    .regex(/^\S*$/, {
      message: "Password must not contain spaces",
    }),
});

export const createUserSchema = zod.object({
  name: zod
    .string({
      required_error: "Name must be not empty",
      invalid_type_error: "Name must be string",
    })
    .min(3, {
      message: "Name must be at least 3 characters",
    })
    .max(50, {
      message: "Name must not be more than 50 characters",
    }),
  username: zod
    .string({
      required_error: "Username must be not empty",
      invalid_type_error: "Username must be string",
    })
    .min(3, {
      message: "Username must be at least 3 characters",
    })
    .max(50, {
      message: "Username must not be more than 50 characters",
    }),
  password: zod
    .string({
      required_error: "Password must be not empty",
    })
    .min(8, {
      message: "Password must be at least 8 characters",
    })
    .max(30, {
      message: "Password must not be more than 30 characters",
    }),
  role: zod.nativeEnum(UserRole, {
    required_error: "Role must be not empty",
  }),
});

export const updateUserSchema = zod.object({
  name: zod
    .string({
      invalid_type_error: "Name must be string",
    })
    .min(3, {
      message: "Name must be at least 3 characters",
    })
    .max(50, {
      message: "Name must not be more than 50 characters",
    })
    .optional(),
  username: zod
    .string({
      required_error: "Username must not be empty",
    })
    .min(3, {
      message: "Username must be at least 3 characters long",
    })
    .max(50, {
      message: "Username must not be more than 50 characters long",
    })
    .optional(),
  password: zod
    .string({
      invalid_type_error: "Password must be string",
    })
    .min(8, {
      message: "Password must be at least 8 characters",
    })
    .max(30, {
      message: "Password must not be more than 30 characters",
    })
    .optional(),
  role: zod.nativeEnum(UserRole).optional(),
});

export const rackSchema = zod.object({
  name: zod
    .string({
      required_error: "Name must be not empty",
    })
    .min(3, {
      message: "Name must be at least 3 characters",
    })
    .max(50, {
      message: "Name must not be more than 50 characters",
    }),
});

export const createProductSchema = zod.object({
  name: zod
    .string({
      required_error: "Name must be not empty",
    })
    .min(3, {
      message: "Name must be at least 3 characters",
    })
    .max(50, {
      message: "Name must not be more than 50 characters",
    }),
  stock: zod.number({
    required_error: "Stock must be not empty",
  }),
  rackId: zod.string({
    required_error: "Rack must be not empty",
  }),
});

export const updateProductSchema = zod.object({
  name: zod
    .string({
      required_error: "Name must be not empty",
    })
    .min(3, {
      message: "Name must be at least 3 characters",
    })
    .max(50, {
      message: "Name must not be more than 50 characters",
    })
    .optional(),
  rackId: zod
    .string({
      required_error: "Rack must be not empty",
    })
    .optional(),
});

export const transactionSchema = zod.object({
  productId: zod.string({
    required_error: "Name must be not empty",
  }),
  type: zod.nativeEnum(TransactionType, {
    required_error: "Type must be not empty",
  }),
  quantity: zod.number({
    required_error: "Quantity must be not empty",
  }),
});
