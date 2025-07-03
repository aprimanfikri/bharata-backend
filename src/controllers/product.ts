import { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma";
import ApiError from "../utils/error";
import { generateUniqueProductCode } from "../utils/util";
import { createProductSchema, updateProductSchema } from "../validation";

export const getAllProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        rack: true,
        transactions: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        rack: true,
        transactions: true,
      },
    });

    if (!product) {
      throw new ApiError("Product not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, stock, rackId } = createProductSchema.parse(req.body);

    const rack = await prisma.rack.findUnique({
      where: { id: rackId },
    });

    if (!rack) {
      throw new ApiError("Rack not found", 404);
    }

    const code = await generateUniqueProductCode(name);

    const product = await prisma.product.create({
      data: {
        name,
        stock,
        code,
        rackId,
      },
      include: {
        rack: true,
        transactions: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const { name, rackId } = updateProductSchema.parse(req.body);

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new ApiError("Product not found", 404);
    }

    let code = product.code;

    if (name && name !== product.name) {
      code = await generateUniqueProductCode(name);
    }

    if (rackId) {
      const rack = await prisma.rack.findUnique({
        where: { id: rackId },
      });

      if (!rack) {
        throw new ApiError("Rack not found", 404);
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name ?? product.name,
        rackId: rackId ?? product.rackId,
        code,
      },
      include: {
        rack: true,
        transactions: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: { product: updatedProduct },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
