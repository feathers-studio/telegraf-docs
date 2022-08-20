// Modules documentation: https://telegraf.js.org/#/?id=telegraf-modules
// $> telegraf -t `BOT TOKEN` hello-bot-module.js

import { Context } from "telegraf";

module.exports = (ctx: Context) => ctx.reply("Hello!");
