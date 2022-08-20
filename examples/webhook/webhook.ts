import { Telegraf } from "telegraf";

const bot = new Telegraf(token);

bot.on("text", ctx => ctx.reply("Hello"));

// Start webhook via launch method (preferred)
bot
	.launch({ webhook: { domain: webhookDomain, port: port } })
	.then(() => console.log("Webhook bot listening on port", port));
