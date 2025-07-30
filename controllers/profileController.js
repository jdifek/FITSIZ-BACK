
const { PrismaClient } = require('@prisma/client');
const { sendMessage } = require('../services/telegramService');
const { getSetting } = require('../services/settingsService');
const prisma = new PrismaClient();
exports.updateProfile = async (req, res) => {
  try {
    const { telegramId, firstName, phone, email, maskId } = req.body;

    if (!telegramId) {
      return res.status(400).json({ error: 'telegramId is required' });
    }

    let mask = null; // 🔧 Объявляем заранее

    if (maskId !== undefined && maskId !== null && maskId !== '') {
      const parsedMaskId = parseInt(maskId);
      if (isNaN(parsedMaskId)) {
        return res.status(400).json({ error: 'Invalid maskId' });
      }

      mask = await prisma.mask.findUnique({ where: { id: parsedMaskId } });
      if (!mask) {
        return res.status(400).json({ error: 'Mask with provided maskId does not exist' });
      }
    }

    const user = await prisma.user.upsert({
      where: { telegramId },
      update: {
        firstName: firstName || undefined,
        phone: phone || null,
        email: email || null,
        maskId: maskId ? parseInt(maskId) : null,
        isBotAvailable: true, // ✅ Добавь это

      },
      create: {
        telegramId,
        firstName: firstName || 'Unknown',
        phone: phone || null,
        email: email || null,
        maskId: maskId ? parseInt(maskId) : null,
      },
      include: { mask: true },
    });

    if (mask && user.telegramId && user.isBotAvailable) {
      const msg = await getSetting('TG_MESSAGE_ON_ADD_MASK');
      if (msg) {
        await sendMessage(user.telegramId, msg);
      } else {
        console.warn('TG_MESSAGE_ON_ADD_MASK not set in settings');
      }
    } else {
      console.warn(`Skip sending: mask=${!!mask}, telegramId=${user.telegramId}, isBotAvailable=${user.isBotAvailable}`);
    }
    

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
