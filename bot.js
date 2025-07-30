const TelegramBot = require('node-telegram-bot-api');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const token = process.env.TELEGRAM_BOT_TOKEN;

// Если ты на localhost — используй polling (без webhooks)
const bot = new TelegramBot(token, { polling: true });
bot.onText(/\/start/, async (msg) => {
  const userId = String(msg.from.id); // ← это ID пользователя (всегда)
  const firstName = msg.from.first_name || 'Без имени';

  try {
    await prisma.user.upsert({
      where: { telegramId: userId },
      update: {
        isBotAvailable: true,
        firstName,
      },
      create: {
        telegramId: userId,
        firstName,
        isBotAvailable: true,
      },
    });

    await bot.sendMessage(msg.chat.id, '👋 Привет! Вы подписались на уведомления.');
    console.log(`User ${userId} подписался`);
  } catch (err) {
    console.error('Ошибка при сохранении Telegram-пользователя:', err.message);
  }
});

