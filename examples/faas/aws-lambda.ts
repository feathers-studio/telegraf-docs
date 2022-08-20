import { Telegraf } from "telegraf";
import makeHandler from "lambda-request-handler";

const bot = new Telegraf(token);

bot.start(ctx => ctx.reply("Hello"));

export const lambdaHandler = makeHandler(
	bot.webhookCallback(bot.secretPathComponent()),
);
