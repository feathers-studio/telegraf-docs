# `[003]` Sending Message

When you want to send user a message then you need to call function to send the message.

In this artice, we'll talk about how can we send a message using our bot.

See also: [official reference to sendMessage](https://core.telegram.org/bots/api#send-message)

### Sending Message using Context (Update Received)

```TS (Node)
bot.hears("hello",async ctx=>{
    ctx.reply("Hi");
})
```

### Sending From Direct API Call

```TS (Node)
// You can get chatId from update
bot.telegram.sendMessage(chatId,"Hello World!")
```

### Advanced

You can pass options to do more actions like `reply_to_message_id` and many more.
You can see official reference given by Telegram to know about usage of options.

# Formatting messages

> The Bot API supports basic formatting for messages. You can use bold, italic, underlined, strikethrough, and spoiler text, as well as inline links and pre-formatted code in your bots' messages. Telegram clients will render them accordingly. [[Read more]](https://core.telegram.org/bots/api#formatting-options)

There are 3 ways to format messages sent to Telegram with Telegraf:

- [Markdown](#markdown)
- [HTML](#html)
- [fmt helpers](#fmt) (recommended!)

## Markdown

Markdown is the easiest answer to formatting, but it comes with its downsides.

> For supported Markdown syntax, refer to https://core.telegram.org/bots/api#markdownv2-style
>
> "Markdown" (before MarkdownV2) is a legacy mode, and must not be used. Use "MarkdownV2" instead.

```TS (Node)
// Inside a handler
ctx.replyWithMarkdownV2("*Bold*, _italic_, and __underlines__\\!");

// Anywhere
bot.telegram.sendMessage("*Bold*, _italic_, and __underlines__\\!", { parse_mode: "MarkdownV2" });
```

Since a variety of characters are reserved for Markdown syntax, if you want to use the character as-is in your text, you must escape it with a `\`. Since `\` by itself is an escape character, it must be escaped again, with `\\`. For example:

```TS (Node)
// Inside a handler
ctx.replyWithMarkdownV2("Sending an asterisk: \\*"); // sends "Sending an asterisk: *"
```

## HTML

While HTML is more verbose than Markdown, fewer characters need escaping.

> For a list of supported tags, refer to https://core.telegram.org/bots/api#html-style

```TS (Node)
// Inside a handler
ctx.replyWithHTML("`<b>`Bold</b>, <i>italic</i>, and <u>underlines</u>!");

// Anywhere
bot.telegram.sendMessage("`<b>`Bold</b>, <i>italic</i>, and <u>underlines</u>!", { parse_mode: "HTML" });
```

## fmt

While HTML and Markdown are the most popular options, a new feature (since v4.10.0) called `fmt` is recommended. While using `fmt`, you may write native-JavaScript template strings, and Telegraf will construct entities for you, and you'll require no escaping and no parse_mode!

> Internally, fmt creates entities. Read more about entities here: https://core.telegram.org/bots/api#formatting-options

```TS (Node)
import { fmt, bold, italic, underline } from "telegraf/format";

// Inside a handler
ctx.sendMessage(fmt`
${bold`Bold`}, ${italic`italic`}, and ${underline`underline`}!
`);
```

You can also naturally nest according to [Formatting options](https://core.telegram.org/bots/api#formatting-options).

```TS (Node)
import { fmt, bold, italics, mention } from "telegraf/format";

// Inside a handler
ctx.reply(fmt`
Ground control to ${bold`${mention("Major Tom", ctx.from.id)}`}
${bold`Lock your ${italic`Soyuz hatch`}`}
And ${italic`put your helmet on`}
— ${link("David Bowie", "https://en.wikipedia.org/wiki/David_Bowie")}
`);
```

This is what that looks like:

<img src="./assets/fmt.jpg" alt="Output of the above code" width="500">

`fmt` also just works with captions, and even with only one of the helpers!

```TS (Node)
// Inside a handler, different variants of using fmt and bold
ctx.replyWithPhoto(file.id, { caption: fmt`File name: ${bold(fileName)}` });
ctx.replyWithPhoto(file.id, { caption: bold`File name: ${fileName}` });
ctx.replyWithPhoto(file.id, { caption: bold(fileName) });
```

---

### Available format helpers:

You need to import the helpers from `"telegraf/format"`. Example:

```TS (Node)
import { fmt, bold } from "telegraf/format";
```

Once imported, you can use them as documented below:

---

#### bold, italic, underline, strikethrough, spoiler

All of these fmt helpers are used in the exact same way. Each of them can be nested and can contain any of the others.

```TS (Node)
// As a tagged template literal, allows string interpolation and nested formatting

// Here, only `name` is underlined
fmt`Hello, ${underline`${name}`}`;

// The entire text is bold, but `name` is also italic
bold`Hello, ${italic`${name}`}`;

// As a function, accepts a single string, and does not support nesting
bold("Hello, " + name);
```

---

#### code

`code` does not support nesting! Used to format as inline monospaced text.

```TS (Node)
// As a tagged template literal, allows string interpolation.
code`Hello, ${name}`;

// As a function, accepts a single string, and does not support nesting
code("Hello, " + name);
```

---

#### pre

`pre` accepts language as a first-parameter, and like `code`, does not support nesting! Used to format as pre-formatted code block.

```TS (Node)
// As a tagged template literal, allows string interpolation.
pre("TypeScript")`Hello, ${name}`;

// As a function, accepts a single string, and does not support nesting
pre("TS")("Hello, " + name);
```

---

#### link

`link` is used to create an inline link, which is similar to an anchor <kbd>\<a href="url"></kbd> in HTML. This helper can only be used as a function, and does not support nesting:

```TS (Node)
link("Link text", URL);
```

---

#### mention

`mention` is used to link to a user by their ID. To use their username, simply use `@username` without any entity. This helper can only be used as a function, and does not support nesting:

```TS (Node)
mention("User", userId);
```

# Reply Markup

You can pass `reply_markup` in options.

There are two types of markup available (as of Bot API 6.6)

1. Inline Keyboard

   Inline Keyboard looks like this :
   <img src="https://core.telegram.org/file/464001950/1191a/2RwpmgU-swU.123554/b50478c124d5914c23">

   You can use Telegraf's Markup for making Inline Keyboard easily.

   ```TS (Node)
   import { Markup } from "telegraf"

   bot.on("message",async ctx=>{
       await ctx.reply("This is a awsome Inline Keyboard",Markup.inlineKeyboard([
           Markup.button.callback('Hey','hey')
       ]))
   });
   ```

   **How to use More Options with Markup?**

   ```TS (Node)
   bot.on("message", async (ctx) => {
   await ctx.reply("<b>This is a awsome Inline Keyboard</b>", {
       reply_markup: Markup.inlineKeyboard([Markup.button.callback("Hey", "hey")]),
       parse_mode: "HTML",
   });
   });
   ```

2. Keyboard

   Keyboard Looks Like this:
   <img src="https://core.telegram.org/file/464001863/110f3/I47qTXAD9Z4.120010/e0ea04f66357b640ec">

   You can just do same as inline but Keyboard doesn't support Markup (by Telegraf)

   ```TS (Node)
   bot.on("message", async (ctx) => {
   await ctx.reply("<b>This is a awsome Keyboard</b>", {
       reply_markup: {
        keyboard:[
            ['Row'], // row 1
            ['Row 2'] // row 2
        ]
       },
       parse_mode: "HTML",
   });
   });
   ```

   You can even send keyboard with options.

   ```TS (Node)
   bot.on("message", async (ctx) => {
   await ctx.reply("<b>This is a awsome Keyboard</b>", {
       reply_markup: {
        keyboard:[
            ['Row'], // row 1
            [{text:'Share Contact',request_contact:true}] // row 2
        ]
       },
       parse_mode: "HTML",
   });
   });
   ```

You can use all these options also in calling `bot.telegram.sendMessage()`

```TS (Node)
bot.telegram.sendMessage(chatId,"<b>Wow</b>",{
    parse_mode:"HTML"
});
```
