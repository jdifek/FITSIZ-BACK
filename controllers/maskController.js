const { getMasks, getMaskInstructions } = require('../services/maskService');

exports.getMasks = async (req, res) => {
  try {
    const masks = await getMasks();
    res.json(masks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMaskInstructions = async (req, res) => {
  try {
    const { id } = req.params;
    const instructions = await getMaskInstructions(parseInt(id));
    if (!instructions) {
      return res.status(404).json({ error: "Mask instructions not found" });
    }
    res.json({ instructions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};