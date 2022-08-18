import { Telegraf } from "telegraf";

const { BOT_TOKEN, WEBHOOK_DOMAIN } = process.env;
const PORT = Number(process.env.PORT) || 3000;

if (!WEBHOOK_DOMAIN) throw new Error('"WEBHOOK_URL" env var is required!');
if (!BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!');

const bot = new Telegraf(BOT_TOKEN);

bot.on("text", ctx => ctx.replyWithHTML("<b>Hello</b>"));

// Start webhook via launch method (preferred)
bot.launch({
	webhook: {
		domain: WEBHOOK_DOMAIN,
		port: PORT,
	},
});
