# Broadcasting

Broadcasting (a.k.a sending messages to a large userbase at once) with a Telegram bot is generally a bad idea. That being said, we get this question often, and some times it's a legitimate usecase, so this article is provided as an answer to it.

## Problems with broadcasting

The Bot API server (and MTProto behind it) will ratelimit your bots heavily if you start sending a lot of outgoing messages at once.

> See also
> * [My bot is hitting limits, how do I avoid this?](https://core.telegram.org/bots/faq#my-bot-is-hitting-limits-how-do-i-avoid-this)
> * [How can I message all of my bot's subscribers at once?](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once)

Apart from this, your bot users may also feel they are being spammed by broadcasts. While channels are opt-in and can be muted, your bot users may not have an option to mute broadcasts although they are enjoying other services provided by your bot. This could lead to a bad user experience, and annoyed users tend to block and stop bot which we don't want that, do we?

## Solutions

You've weighed the problems and decided you still need to broadcast messages. Alright! Let's look at some solutions.

### Solution 1: Use a Telegram channel

Rather than sending a message to a large audience via your bot chat, consider using a channel instead. Channels are designed for this specific purpose. Bots are also able to send messages to a channel! They need to be added as an admin first, and then you can use:

```TS (Node)
bot.telegram.sendMessage(channelId, message);
```

"But how do I tell my users about the channel?", you ask. Fair question. One idea is to embed the "Follow our channel @channel for updates" in a message commonly seen by many other bots. For example, this may be in response to a `/start` command, a main menu trigger, etc.

```TS (Node)
  // User starts using your bot with a "/start" command: 

 // Telegraf has a built-in middleware to handle a "/start" command, but feel free to use other methods as well
 bot.start(ctx => {
   
   ctx.reply('Hello, this is a cat video downloader bot. To download a video, simply send its link. To get updates on our purry friends, join @examplecatchannel!');
 });
```

### Solution 2: Use a queue

If you do need to broadcast with the bot and send messages at the highest volume possible, you could use a queue (e.g, using [bull (Redis)](https://www.npmjs.com/package/bull), [amqplib (RabbitMQ)](https://www.npmjs.com/package/amqplib), etc.). You'd push messages onto the queue first, then have a worker pick messages from the queue, send them as fast as it can—UNTIL you get your first `"429: Too Many Requests"` error response. The response object will look like this:

```JSON
{
 "ok": false,
 "error_code": 429,
 "description": "Too Many Requests: retry after 3",
 "parameters": { "retry_after": 3 }
}
```

The moment you receive a 429 flood wait, you should stop sending messages and wait for the number of seconds specified by `parameters.retry_after`. In this example, it's 3 seconds, so you will pause the worker for 3 seconds and then start picking and sending messages from the queue again. This method may still take a long time for a large audience (>10000), but is the only possible way to achieve sending the maximum volume of messages without getting banned.
