const { getCatalog } = require('../services/catalogService');

exports.getCatalog = async (req, res) => {
  try {
    const catalog = await getCatalog();
    res.json(catalog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};