import { fastify } from "fastify";
import { Telegraf } from "telegraf";

const bot = new Telegraf(token);
const app = fastify();

const webhook = await bot.createWebhook({ domain: webhookDomain });

app.post(`/telegraf/${bot.secretPathComponent()}`, webhook);

bot.on("text", ctx => ctx.reply("Hello"));

app.listen({ port: port }).then(() => console.log("Listening on port", port));
