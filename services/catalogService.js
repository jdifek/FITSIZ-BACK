const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCatalog = async (name) => {
  const where = name ? { name: { contains: name, mode: 'insensitive' } } : {};
  return await prisma.catalogItem.findMany({ where });
};