# `[002]` Listening for updates and responding to them

> This article is a work-in-progress.

Once you start your bot, Telegram sends you updates based on each request that is being made to the bot.

> See also: [official reference](https://core.telegram.org/bots/api#getting-updates)

Messages are one type of `update` that can be sent, but not the only one. When users send messages, your bot receives a `MessageUpdate`. It looks like this: `{ update_id, message }`. When users make callback queries, it receives `CallbackQueryUpdate`, which looks like this: `{ update_id, callback_query }`.

Telegraf allows you to listen to these updates using a simple syntax:

```TS (Node)
bot.on("message", ctx => {
	// Use ctx.message to access the "message" object
});

bot.on("callback_query", ctx => {
	// Usage: ctx.callbackQuery
});

bot.on("chat_join_request", ctx => {
	// Usage: ctx.chatJoinRequest
});
```

But, remember that all messages are not text messages either!. Messages can be `text`, `animation`, `photo`, `video`, or they can be service messages like `video_chat_started`, `successful_payment`. These can also be filtered for with filters!

```TS (Node)
// You can import different filters based on your needs
import { message, callbackQuery, channelPost } from "telegraf/filters"

bot.on(message("text"), ctx => {
	// Use ctx.message.text to access the text message
});

bot.on(callbackQuery("data"), ctx => {
	// Usage: ctx.callbackQuery.data
});

bot.on(channelPost("video"), ctx => {
	// Usage: ctx.channelPost.video
});
```

You can also filter more complex updates, for instance:

```TS (Node)
// Listen for text messages that were forwarded
bot.on(message("forward_from", "text"), ctx => {
	// These properties are accessible in this type of "Message", but otherwise would throw an error
	ctx.message.text;
	ctx.message.forward_from.first_name;
});

// Listen for photos that are part of an album (a.k.a. a media group)
bot.on(message("photo", "media_group_id"), ctx => {
	// These properties are accessible in this type of "Message", but otherwise would throw an error
	ctx.message.photo;
	ctx.message.media_group_id;
});
```

But receiving updates might not usefull, if you are not responding to them. To send a message in the same chat as we received a message from, you can simply use `ctx.sendMessage`.

```TS (Node)
bot.on(message("text"), async ctx => {
	await ctx.sendMessage("Hello!");
});
```
