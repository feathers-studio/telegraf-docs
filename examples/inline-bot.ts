import { Telegraf, Markup } from "telegraf";
import { InlineQueryResult } from "telegraf/types";

const bot = new Telegraf(token);

bot.on("inline_query", async ctx => {
	const apiUrl = `http://recipepuppy.com/api/?q=${ctx.inlineQuery.query}`;
	const response = await fetch(apiUrl);
	const { results } = await response.json();
	const recipes = (
		results as { title: string; href: string; thumbnail: string }[]
	)
		.filter(({ thumbnail }) => thumbnail)
		.map(
			({ title, href, thumbnail }): InlineQueryResult => ({
				type: "article",
				id: thumbnail,
				title: title,
				description: title,
				thumb_url: thumbnail,
				input_message_content: {
					message_text: title,
				},
				...Markup.inlineKeyboard([Markup.button.url("Go to recipe", href)]),
			}),
		);
	return await ctx.answerInlineQuery(recipes);
});

bot.on("chosen_inline_result", ({ chosenInlineResult }) => {
	console.log("chosen inline result", chosenInlineResult);
});

bot.launch();
