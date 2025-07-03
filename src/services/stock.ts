import { TransactionType, Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import ApiError from "../utils/error";

export const handleStockUpdate = async (
  productId: string,
  type: TransactionType,
  quantity: number,
  userId: string
) => {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    return await prisma.$transaction(
      async (tx) => {
        if (type === TransactionType.IN) {
          const updatedProduct = await tx.product.update({
            where: { id: productId },
            data: { stock: { increment: quantity } },
          });
          if (!updatedProduct) {
            throw new ApiError("Product not found", 404);
          }
        } else {
          const updatedProductRows = await tx.$queryRaw<
            Array<{ id: string; stock: number }>
          >`
              UPDATE "Product"
              SET stock = stock - ${quantity}
              WHERE id = ${productId} AND stock >= ${quantity}
              RETURNING id, stock;
            `;

          if (updatedProductRows.length === 0) {
            const productExists = await tx.product.count({
              where: { id: productId },
            });
            if (productExists === 0) {
              throw new ApiError("Product not found", 404);
            } else {
              throw new ApiError("Stock not enough", 400);
            }
          }
        }

        const transactionRecord = await tx.transaction.create({
          data: {
            productId,
            type,
            userId,
            amount: quantity,
          },
        });

        return transactionRecord;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      }
    );
  }

  throw new ApiError(
    "Failed to update stock after multiple retries. All attempts failed.",
    500
  );
};
