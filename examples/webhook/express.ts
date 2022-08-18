import express from "express";
import { Telegraf } from "telegraf";

const { BOT_TOKEN, WEBHOOK_DOMAIN } = process.env;
const PORT = Number(process.env.PORT) || 3000;

if (!WEBHOOK_DOMAIN) throw new Error('"WEBHOOK_URL" env var is required!');
if (!BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!');

const bot = new Telegraf(BOT_TOKEN);
const app = express();

// Set the bot API endpoint
app.use(await bot.createWebhook({ domain: WEBHOOK_DOMAIN }));

bot.on("text", ctx => ctx.reply("Hello"));

app.listen(PORT, () => console.log("Listening on port", PORT));
