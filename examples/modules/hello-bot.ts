// To run a Telegraf module, use:
// $> telegraf -t `BOT TOKEN` hello-bot.js

import { Context } from "telegraf";

export default (ctx: Context) => ctx.reply("Hello!");
