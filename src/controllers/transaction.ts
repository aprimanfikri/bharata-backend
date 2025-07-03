import { NextFunction, Request, Response } from "express";
import { transactionSchema } from "../validation";
import { TransactionType } from "@prisma/client";
import { handleStockUpdate } from "../services/stock";
import prisma from "../lib/prisma";
import ApiError from "../utils/error";

export const getAllTransactions = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        user: true,
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      data: { transactions },
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        user: true,
        product: true,
      },
    });

    if (!transaction) {
      throw new ApiError("Transaction not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Transaction fetched successfully",
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    const { productId, type, quantity } = transactionSchema.parse(req.body);

    const transaction = await handleStockUpdate(
      productId,
      type as TransactionType,
      quantity,
      userId!
    );

    res.status(201).json({
      success: true,
      message: "Transaction created",
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};
