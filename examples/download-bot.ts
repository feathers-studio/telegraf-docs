import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { mkdirSync, createWriteStream } from "node:fs";
import { Writable } from "node:stream";

// ensure photos directory exists
mkdirSync("./photos", { recursive: true });

if (process.env.BOT_TOKEN === undefined) {
	throw new TypeError("BOT_TOKEN must be provided!");
}

const bot = new Telegraf(process.env.BOT_TOKEN);

// small helper
const download = async (fromFileId: string, toPath: string) => {
	const link = await bot.telegram.getFileLink(fromFileId);
	const res = await fetch(link.toString());
	await res.body!.pipeTo(Writable.toWeb(createWriteStream(toPath)));
};

// handler that downloads all photos the bot sees to a photos
bot.on(message("photo"), async ctx => {
	// take the last photosize (highest size)
	const { file_id } = ctx.message.photo.pop()!;
	const path = `./photos/${file_id}.jpg`;

	await download(file_id, path);

	console.log("Downloaded", path);
});

bot.launch();
