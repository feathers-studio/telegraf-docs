import { fastify } from "fastify";
import { Telegraf } from "telegraf";

const { BOT_TOKEN, WEBHOOK_DOMAIN } = process.env;
const PORT = Number(process.env.PORT) || 3000;

if (!WEBHOOK_DOMAIN) throw new Error('"WEBHOOK_URL" env var is required!');
if (!BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!');

const bot = new Telegraf(BOT_TOKEN);
const app = fastify();

const webhook = await bot.createWebhook({ domain: WEBHOOK_DOMAIN });

app.post(bot.secretPathComponent(), (req, rep) => webhook(req.raw, rep.raw));

bot.on("text", ctx => ctx.reply("Hello"));

app.listen({ port: PORT }).then(() => console.log("Listening on port", PORT));
