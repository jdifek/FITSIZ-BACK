const { getVideos } = require('../services/videoService');

exports.getVideos = async (req, res) => {
  try {
    const videos = await getVideos();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};