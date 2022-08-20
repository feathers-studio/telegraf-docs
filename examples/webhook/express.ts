import express from "express";
import { Telegraf } from "telegraf";

const bot = new Telegraf(token);
const app = express();

// Set the bot API endpoint
app.use(await bot.createWebhook({ domain: webhookDomain }));

bot.on("text", ctx => ctx.reply("Hello"));

app.listen(port, () => console.log("Listening on port", port));
