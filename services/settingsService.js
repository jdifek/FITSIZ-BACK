const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getSetting = async (key) => {
  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value || null;
};

exports.setSetting = async (key, value) => {
  return prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
};
