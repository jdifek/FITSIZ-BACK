const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getMasks = async () => {
  return await prisma.mask.findMany();
};