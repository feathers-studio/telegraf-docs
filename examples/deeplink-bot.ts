// https://core.telegram.org/bots#deep-linking
import { Telegraf } from "telegraf";

const { BOT_TOKEN } = process.env;
if (!BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!');
const bot = new Telegraf(BOT_TOKEN);

bot.start(ctx => ctx.reply(`Deep link payload: ${ctx.startPayload}`));

bot.launch();
