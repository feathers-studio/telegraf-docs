import { Telegraf, Markup } from "telegraf";

const gameShortName = "your-game";
const gameUrl = "https://your-game.tld";

const markup = Markup.inlineKeyboard([
	Markup.button.game("🎮 Play now!"),
	Markup.button.url("Telegraf help", "http://telegraf.js.org"),
]);

const bot = new Telegraf(token);
bot.start(ctx => ctx.replyWithGame(gameShortName));
bot.command("foo", ctx => ctx.replyWithGame(gameShortName, markup));
bot.gameQuery(ctx => ctx.answerGameQuery(gameUrl));

bot.launch();
