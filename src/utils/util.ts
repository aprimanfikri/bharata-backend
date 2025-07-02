import prisma from '../lib/prisma';

const generateInitialCode = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word[0].toUpperCase())
    .join('');
};

export const generateUniqueProductCode = async (
  name: string
): Promise<string> => {
  const baseCode = generateInitialCode(name);
  let code = baseCode;
  let counter = 1;

  while (true) {
    const existing = await prisma.product.findUnique({
      where: { code },
    });

    if (!existing) break;

    code = `${baseCode}-${counter}`;
    counter++;
  }

  return code;
};
