import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN!);

const WEB_APP_URL = "https://feathers.studio/telegraf/webapp/example";

bot.command("setmenu", ctx =>
	// sets Web App as the menu button for current chat
	ctx.setChatMenuButton({
		text: "Launch",
		type: "web_app",
		web_app: { url: WEB_APP_URL },
	}),
);

bot.launch();
