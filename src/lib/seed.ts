import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";
import { ADMIN_PASSWORD, ADMIN_USERNAME } from "../utils/env";

const prisma = new PrismaClient();

const main = async () => {
  const hash = hashSync(ADMIN_PASSWORD as string);

  const user = await prisma.user.create({
    data: {
      name: "Admin",
      username: ADMIN_USERNAME as string,
      password: hash,
      role: "ADMIN",
    },
  });

  console.log("User successfully created:", user);

  const rack = await prisma.rack.create({
    data: {
      name: "Rak 1",
    },
  });

  console.log("Rack successfully created:", rack);

  const product = await prisma.product.create({
    data: {
      name: "Product 1",
      stock: 100000,
      rackId: rack.id,
      code: "P1",
    },
  });

  console.log("Product successfully created:", product);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
