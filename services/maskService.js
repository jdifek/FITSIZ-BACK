const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getMasks = async () => {
  return await prisma.mask.findMany();
};

exports.getMaskInstructions = async (maskId) => {
  const mask = await prisma.mask.findUnique({
    where: { id: maskId },
    select: { instructions: true },
  });
  return mask?.instructions;
};