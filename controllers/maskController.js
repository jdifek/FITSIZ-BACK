const { getMasks } = require('../services/maskService');

exports.getMasks = async (req, res) => {
  try {
    const masks = await getMasks();
    res.json(masks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};