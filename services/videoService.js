const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getVideos = async () => {
  return await prisma.video.findMany();
};