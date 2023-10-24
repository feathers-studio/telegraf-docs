// here's a real working example of using firebase functions via a webhook

import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { Telegraf, Context } from 'telegraf';
import { message } from 'telegraf/filters';

// create a new bot instance that will handle the updates and reply via webhook
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN as string,{telegram: { webhookReply: true }});

// register the commands and event handlers IN THE ORDER they will be executed
bot.command('start', (ctx: Context) => ctx.reply('Welcome!'));
bot.command('help', (ctx: Context) => ctx.reply('How can I assist you?'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
bot.on(message('new_chat_members'), async (ctx) => {
  logger.info('new_chat_members:', ctx.update.message.new_chat_members);
  const newMembers = ctx.message.new_chat_members;
  newMembers.forEach((member) => {
    ctx.reply(`Welcome ${member.first_name} to the group!`);
  });
});

// message seems to be the default handler for most other message type
bot.on(message('text'), (ctx: Context) => ctx.reply('Hello!'));

export const myBot = onRequest(async (request, response) => {
  try {
    logger.log(JSON.stringify(request.body)); // for debugging - remove in production
    await bot.handleUpdate(request.body, response);
    response.status(200).end();
  } catch (err) {
    logger.error('Failed to process update', err);
    response.sendStatus(500);
  }
});

