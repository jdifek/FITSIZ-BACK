const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCatalog = async () => {
  return await prisma.catalogItem.findMany();
};