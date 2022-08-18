import { Telegraf } from "telegraf";
import Koa from "koa";
import koaBody from "koa-body";

const { BOT_TOKEN, WEBHOOK_DOMAIN } = process.env;
const PORT = Number(process.env.PORT) || 3000;

if (!WEBHOOK_DOMAIN) throw new Error('"WEBHOOK_URL" env var is required!');
if (!BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!');

const bot = new Telegraf(BOT_TOKEN);
const app = new Koa();

// First reply will be served via webhook response,
// but messages order not guaranteed due to `koa` pipeline design.
// Details: https://github.com/telegraf/telegraf/issues/294
bot.command("image", ctx => ctx.replyWithPhoto({ url: "https://picsum.photos/200/300/?random" }));
bot.on("text", ctx => ctx.reply("Hello"));

app.use(koaBody());

app.use(async (ctx, next) => (await bot.createWebhook({ domain: WEBHOOK_DOMAIN }))(ctx.req, ctx.res, next));

app.listen(PORT);
