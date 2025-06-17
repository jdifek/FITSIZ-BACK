const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getUser = async (telegramId) => {
  return await prisma.user.findUnique({
    where: { telegramId },
  });
};