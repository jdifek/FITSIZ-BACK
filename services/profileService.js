const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.updateProfile = async (telegramId, phone, email, maskId) => {
  return await prisma.user.update({
    where: { telegramId },
    data: { phone, email, maskId },
  });
};