## `[001]` Your first Telegram bot!

To build a bot, you first need a bot token. You can get one by talking to [@botfather](https://t.me/botfather) on Telegram. Once you've spoken to Botfather to create a bot account and got a token, we can start writing the code to make it work!

<!-- TODO@mkr// New achievement: Acquired Token! -->

Start by creating a folder, initialising a project, and installing Telegraf.

```shell
# create folder
mkdir my-first-bot

# enter folder
cd my-first-bot

# install Telegraf
npm install telegraf

# install typescript as a dev-dependency (optional, but recommended)
npm install --dev typescript

# initialise a typescript config
npx tsc --init
```

Now create the entry file for your bot. We'll call this `index.ts` if you use TypeScript (<u>or `index.js` if you prefer writing JS</u>. See ["Why TypeScript?"](TODO@mkr//write-article)).

Open your favourite code editor (we recommend [Visual Studio Code](https://code.visualstudio.com), but you can use pretty much any editor) and follow along!

The first thing you need to do is to import Telegraf and create a bot instance. You will need to pass your bot token while doing so. Our recommended way to pass the token is via an environment variable. If you don't know how, we have [an article on that!](TODO@mkr//write-article)

```TS (Node)
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);
```

Subsequently, you need to start listening for updates from Telegram. The simpest way to do this is just to call `bot.launch()`.

> Note: By default this uses long-polling ([what's that?](TODO@mkr//write-article)), but using [webhooks](TODO@mkr//write-article) is also supported. We'll see these options in detail in a later chapter.

```TS (Node)
bot.launch();
```

Now our bot is alive and is listening for updates from Telegram. But it's not doing anything interesting yet. All the magic happens between `new Telegraf` and `bot.launch()`.

When Telegram users first discover your bot, they will send a `/start` command. It's a good idea to reply to this to let your user know what the bot can do. To listen to `/start` commands, we use the `bot.start` function, and pass a handler to it.

```TS (Node)
// Remember, this should ideally be written before `bot.launch()`!

bot.start(ctx => {
  return ctx.reply(`Hello ${ctx.update.message.from.first_name}!`);
});
```

You notice that the handler receives a Context object. This is a wrapper around the `Update` object Telegram sends us. Telegraf adds useful methods and shortcuts for convenience. One of these shortcut methods is `ctx.reply`. This method sends a message back in the same chat, without your explicitly having to pass `chatId`. The raw update object is found in `ctx.update`.

Since the `/start` command is a MessageUpdate, Telegraf knows that `ctx.update.message` is available, and that also means `message.from`. We use this information to respond to the user with <code>\`Hello ${first_name}!\`</code>.

Let's put all our pieces together.

```TS (Node)

import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx => {
  return ctx.reply(`Hello ${ctx.update.message.from.first_name}!`);
});

bot.launch();
```

To start your bot, run the following:

```shell
# Compile first, if you're using TS
npx tsc

# Run the bot
node index.js
```

If you made it this far, congrats! You've written your first bot that responds `"Hello, user!"` to users who start the bot. You should test it out!

<!-- TODO@mkr// New achievement: Responded to your first message! -->

[[Chapter-2: Listening for more updates]](./002-listen-and-respond.md)
