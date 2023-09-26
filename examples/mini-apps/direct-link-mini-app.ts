import { Telegraf } from "telegraf";
import { link } from "telegraf/format";

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.command("link", ctx =>
	/*
		Go to @Botfather and create a new app for your bot first, using /newapp
		Then modify this link appropriately.
	
		startapp is optional.
		If provided, it will be passed as start_param in initData
		and as ?tgWebAppStartParam=$command in the Web App URL
	*/
	ctx.reply(link("Launch", "https://t.me/$botname/$appname?startapp=$command")),
);

bot.launch();
