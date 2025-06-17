const { updateProfile } = require('../services/profileService');

exports.updateProfile = async (req, res) => {
  try {
    const { telegramId, phone, email, maskId } = req.body;
    const updatedProfile = await updateProfile(telegramId, phone, email, maskId);
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};