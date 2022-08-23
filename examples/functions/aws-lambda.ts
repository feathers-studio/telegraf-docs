import { Telegraf } from "telegraf";
import serverless from "serverless-http";

const bot = new Telegraf(token);

bot.start(ctx => ctx.reply("Hello"));

export const lambdaHandler = serverless(
	bot.webhookCallback(bot.secretPathComponent()),
);
