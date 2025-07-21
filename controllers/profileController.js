
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.updateProfile = async (req, res) => {
  try {
    const { telegramId, firstName, phone, email, maskId } = req.body;
    if (!telegramId) {
      return res.status(400).json({ error: 'telegramId is required' });
    }
    if (maskId !== undefined && maskId !== null && maskId !== '') {
      const parsedMaskId = parseInt(maskId);
      if (isNaN(parsedMaskId)) {
        return res.status(400).json({ error: 'Invalid maskId' });
      }
      const mask = await prisma.mask.findUnique({ where: { id: parsedMaskId } });
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
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
