# `[002]` Listening for updates and responding to them

> This article is a work-in-progress.

Once you start your bot, Telegram sends you updates.

> See also: [official reference](https://core.telegram.org/bots/api#getting-updates)

Messages are one type of update, but not the only one. When users send messages, your bot receives a `MessageUpdate`. It looks like: `{ update_id, message }`. When users make callback queries, it receives `CallbackQueryUpdate`, which looks like `{ update_id, callback_query }`.

You should import filter like this :
```TS (Node)
import { message, callbackQuery, channelPost } from "telegraf/filters"
```

Telegraf allows you to listen to these updates using a simple syntax:

```TS (Node)
bot.on(message("text"), ctx => {
	// Use ctx.message.text
});

bot.on(callbackQuery("game_short_name"), ctx => {
	// Use ctx.callbackQuery.game_short_name
});

bot.on(channelPost("video"), ctx => {
	// Use ctx.channelPost.video
});
```

Remember that all messages are not text messages either! Messages can be `text`, `animation`, `photo`, `video`, or they can be service messages like `video_chat_started`, `successful_payment`. These can also be filtered for with `bot.on`!

```TS (Node)
bot.on(message("text"), handleTextMessage);
```

But receiving updates is not enough, we also need to reply to them.
