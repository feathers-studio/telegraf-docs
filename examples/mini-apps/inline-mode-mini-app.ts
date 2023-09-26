import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN!);

const WEB_APP_URL = "https://feathers.studio/telegraf/webapp/example";

bot.on("inline_query", ctx =>
	ctx.answerInlineQuery([], {
		button: { text: "Launch", web_app: { url: WEB_APP_URL } },
	}),
);

bot.launch();
