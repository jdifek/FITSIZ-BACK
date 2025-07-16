const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCatalog = async (name) => {
  return await prisma.catalogItem.findMany({
    where: name ? { name: { contains: name, mode: 'insensitive' } } : {},
    include: {
      mask: true,
      reviews: true,
    },
  });
};