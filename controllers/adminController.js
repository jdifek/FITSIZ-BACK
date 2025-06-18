const { createMask, deleteUser } = require('../services/adminService');

exports.createMask = async (req, res) => {
  try {
    const { name, instructions } = req.body;
    const mask = await createMask(name, instructions);
    res.status(201).json(mask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { telegramId } = req.params;
    await deleteUser(telegramId);
    res.status(204).send(); // No content on successful deletion
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};