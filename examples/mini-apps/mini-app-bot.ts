import { Markup, Telegraf } from "telegraf";
import { link } from "telegraf/format";

if (process.env.BOT_TOKEN === undefined) {
	throw new TypeError("BOT_TOKEN must be provided!");
}

const bot = new Telegraf(process.env.BOT_TOKEN);

const WEB_APP_URL = "WEB_APP_URL";
// "https://mkr.dev.thefeathers.co/"

// Type 1: Keyboard button Mini App
bot.command("keyboard", ctx =>
	ctx.reply(
		"Launch mini app from keyboard!",
		Markup.keyboard([Markup.button.webApp("Launch", WEB_APP_URL)]).resize(),
	),
);

// Type 2: Inline keyboard button Mini App
bot.command("inlinekb", ctx =>
	ctx.reply(
		"Launch mini app from inline keyboard!",
		Markup.inlineKeyboard([Markup.button.webApp("Launch", WEB_APP_URL)]),
	),
);

// Type 3: Inline mode Mini App
bot.on("inline_query", ctx =>
	ctx.answerInlineQuery([], {
		button: { text: "Launch", web_app: { url: WEB_APP_URL } },
	}),
);

// Type 4: Menu button Mini App
bot.command("setmenu", ctx =>
	// sets Web App as the menu button for current chat
	ctx.setChatMenuButton({
		text: "Launch",
		type: "web_app",
		web_app: { url: WEB_APP_URL },
	}),
);

// Type 5: Direct link Mini app
bot.command("setmenu", ctx =>
	// Go to @Botfather and create a new app for your bot first, using /newapp
	ctx.reply(link("Launch", "https://t.me/botname/appname")),
);

// Type 6: Attachment menu
// Only available for major advertisers on the Telegram Ad Platform.
// Set from Bot Settings > Configure Attachment Menu in @Botfather

bot.launch();
