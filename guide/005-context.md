# Context

> Context Class is a vey important part of Telegraf ([API REFERENCE](https://telegraf.js.org/classes/Context.html))
> Whenever you register a listener on your bot object, this listener will receive a context object.

```javascript
bot.on("message", (ctx) => {
  // `ctx` is the `Context` class.
});
```

You can use the context object to

<ol>
  <li><a href="#Information">access information about the message</a>
    <li><a href="#Action">perform actions in response to the message</a>
</ol>

> Context is called ctx commonly in short form.

### Information

**Access Information About the Message, Chat , etc**

```javascript
bot.on("message", (ctx) => {
  const txt = ctx.message.text; // undefined if text is empty
  const sender = ctx.from.id; // the user who sent the message
  const fname = ctx.from.first_name; // the first name of the user who sent the message
  const message_id = ctx.message.message_id; // the id of the message

  // There are many more that you can get through your IDE or searching telegraf.js.org
});
```

### Action

**Do actions with the context class**

```javascript
bot.on("message", (ctx) => {
ctx.replyWithMarkdownV2("*Hello*);
ctx.replyWithHTML("<b>Hello</b>*");

ctx.forwardMessage("chat");
// There are many more functions that you can get through your IDE or searching telegraf.js.org
});
```

# Why use context actions ?

When you use the telegram's plain API then you do :

```javascript
bot.on("message", async (ctx) => {
  const chatId = ctx.from.id;
  const text = "New Message";
  await bot.telegram.sendMessage(chatId, text);
});
```

**With Context Method**

```javascript
bot.on("message", async (ctx) => {
  ctx.replyWithHTML("<b>New Message</b>");
});
```

With context your code is more consized and neat 👍

# How Context Objects Are Created

Whenever your bot receives a new message from Telegram, it is wrapped in an update object. In fact, update objects can not only contain new messages, but also all other sorts of things, such as edits to messages, poll answers, and much more.

A fresh context object is created exactly once for every incoming update. Contexts for different updates are completely unrelated objects, they only reference the same bot information via ctx.me.

The same context object for one update will be shared by all installed [middleware](#Middleware) on the bot.

# Customizing the Context Class

You can install your own properties on the context object if you want.

# Middleware

Middleware ! What is this ? 🤔
In short, when you add any listner the middleware will be called then your listner callback will be fired.

Example :

```javascript
bot.use(async (ctx, next) => {
  if ((ctx.from.id = "bad_user")) {
    ctx.replyWithMarkdownV2("You are bad user");
  } else {
    await next();
  }
});

bot.on("message", (ctx) => {
  ctx.reply("Yay ! You passed middleware");
});
```

> **Warning**
> You must await next();

How does the code above worked ?

```
bot > middleware > listner
```

First the middleware will be called then the listner

Other type of middlewares :

```javascript
bot.on("message", (ctx, next) => {}); // This middleware will be called only on messages
```

### Modifing the middleware

You can add custom properties in the context object through middleware like :

```javascript
bot.use((ctx,next)=>{
ctx.custom.replyToMessage = (text)=>{
ctx.replyWithHTML(text,{reply_to_message_id : ctx.message.message_id});
}

await next();
});

bot.hears("hii",ctx=>{
ctx.custom.replyToMessage("<b>Wow</b>");
})
```
