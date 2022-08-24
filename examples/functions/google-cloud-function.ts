// TODO: this needs its own full example like the one for aws-lambda

import { Telegraf } from "telegraf";

const bot = new Telegraf(token);

bot.command("hello", ctx => ctx.reply("Hello, friend!"));

export const botFunction = bot.webhookCallback(bot.secretPathComponent());
