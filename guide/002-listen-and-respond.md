# `[002]` Listening for updates and responding to them

> This article is a work-in-progress.

Once you start your bot, Telegram sends you updates.

> See also: [official reference](https://core.telegram.org/bots/api#getting-updates)

Messages are one type of update, but not the only one. When users send messages, your bot receives a `MessageUpdate`. It looks like: `{ update_id, message }`. When users make callback queries, it receives `CallbackQueryUpdate`, which looks like `{ update_id, callback_query }`.

Telegraf allows you to listen to these updates using a simple syntax:

```TS (Node)
bot.on("message", ctx => {
	// Use ctx.message
});

bot.on("callback_query", ctx => {
	// Use ctx.callbackQuery
});

bot.on("chat_join_request", ctx => {
	// Use ctx.chatJoinRequest
});
```

But, remember that all messages are not text messages either! Messages can be `text`, `animation`, `photo`, `video`, or they can be service messages like `video_chat_started`, `successful_payment`. These can also be filtered for with filters!

```TS (Node)
// import filters
import { message, callbackQuery, channelPost } from "telegraf/filters"

bot.on(message("text"), ctx => {
	// Use ctx.message.text
});

bot.on(callbackQuery("data"), ctx => {
	// Use ctx.callbackQuery.data
});

bot.on(channelPost("video"), ctx => {
	// Use ctx.channelPost.video
});
```

You can also filter for more complex updates, like:

```TS (Node)
// Listen for text messages that were forwarded
bot.on(message("forward_from", "text"), ctx => {
	// These properties are accessible:
	ctx.message.text;
	ctx.message.forward_from.first_name;
});

// Listen for photos messages that are part of an album (media group)
bot.on(message("photo", "media_group_id"), ctx => {
	// These properties are accessible:
	ctx.message.photo;
	ctx.message.media_group_id;
});
```

But receiving updates is not enough, we also need to reply to them. To send a message in the same chat as we received a message from, you can simply use `ctx.sendMessage`.

```TS (Node)
bot.on(message("text"), async ctx => {
	await ctx.sendMessage("Hello!");
});
```

You can also listen to other updates like this.

- Command

```TS (Node)
bot.command('commandName',async ctx=>{
	await ctx.reply("Hello");
});
```

- Message

```TS (Node)
bot.hears('Hi',async ctx=>{
	await ctx.reply("Hello");
});
```

- Callback Query (Inline Keyboard)

```TS (Node)
bot.action('action',async ctx=>{
	await ctx.answerCbQuery("Hello");
});
```
