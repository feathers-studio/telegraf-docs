import { Markup, Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN!);

const WEB_APP_URL = "https://feathers.studio/telegraf/webapp/example";

bot.command("inlinekb", ctx =>
	ctx.reply(
		"Launch mini app from inline keyboard!",
		Markup.inlineKeyboard([Markup.button.webApp("Launch", WEB_APP_URL)]),
	),
);

bot.launch();
