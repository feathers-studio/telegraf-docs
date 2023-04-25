import { fastify, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Telegraf } from "telegraf";
import {Update} from "typegram/update";

type TWebhookReq = http.IncomingMessage & {body?: Update};

const bot = new Telegraf(token);
const app: FastifyInstance = fastify();

const webhook = await bot.createWebhook({ domain: webhookDomain });
const callbackUrl = `/telegraf/${bot.secretPathComponent()}`;

app.post(callbackUrl, (req: FastifyRequest, rep: FastifyReply) => {
    return webhook({...req.raw, body: req.body} as TWebhookReq, rep.raw as http.ServerResponse);
});

bot.on("text", ctx => ctx.reply("Hello"));

app.listen({ port: port }).then(() => console.log("Listening on port", port));
