const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createMask = async (name, instructions) => {
  return await prisma.mask.create({
    data: { name, instructions },
  });
};

exports.deleteUser = async (telegramId) => {
  return await prisma.user.delete({
    where: { telegramId },
  });
};