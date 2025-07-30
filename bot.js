const TelegramBot = require('node-telegram-bot-api');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const token = process.env.TELEGRAM_BOT_TOKEN;

// Если ты на localhost — используй polling (без webhooks)
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const chatId = String(msg.user.id);
  const firstName = msg.user.first_name || 'Без имени';

  try {
    await prisma.user.upsert({
      where: { telegramId: chatId },
      update: {
        isBotAvailable: true,
        firstName,
      },
      create: {
        telegramId: chatId,
        firstName,
        isBotAvailable: true,
      },
    });

    await bot.sendMessage(chatId, '👋 Привет! Вы подписались на уведомления.');
    console.log(`User ${chatId} подписался`);
  } catch (err) {
    console.error('Ошибка при сохранении Telegram-пользователя:', err.message);
  }
});
