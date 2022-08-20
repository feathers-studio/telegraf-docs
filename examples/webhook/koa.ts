import { Telegraf } from "telegraf";
import Koa from "koa";
import koaBody from "koa-body";

const bot = new Telegraf(token);
const app = new Koa();

// First reply will be served via webhook response,
// but messages order not guaranteed due to `koa` pipeline design.
// Details: https://github.com/telegraf/telegraf/issues/294
bot.command("image", ctx =>
	ctx.replyWithPhoto({ url: "https://picsum.photos/200/300/?random" }),
);
bot.on("text", ctx => ctx.reply("Hello"));

app.use(koaBody());

app.use(async (ctx, next) =>
	(await bot.createWebhook({ domain: webhookDomain }))(ctx.req, ctx.res, next),
);

app.listen(port, () => console.log("Listening on port", port));
