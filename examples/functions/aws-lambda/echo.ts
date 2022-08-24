import http from "serverless-http";
import { Telegraf } from "telegraf";

const token = process.env.BOT_TOKEN!;
const bot = new Telegraf(token);

// echo
bot.on("text", ctx => ctx.reply(ctx.message.text));

// setup webhook
export const echobot = http(bot.webhookCallback("/telegraf"));
