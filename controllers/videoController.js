const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getVideos = async (req, res) => {
  try {
    const videos = await prisma.video.findMany();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await prisma.video.findUnique({
      where: { id: parseInt(id) },
    });
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.json(video);
  } catch (error) {
    console.error("Get video error:", error.message);
    res.status(500).json({ error: error.message });
  }
};