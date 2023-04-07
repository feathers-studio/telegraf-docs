# `[006]` Filters in Telegraf

You can use `bot.on` listener with `message("text")` or any other filter

> **Note**<br>
> bot.on("message"|"other_type") has been deprecated. It may be removed in future versions. So prefer new filters.

# Available Types

You can see all available filters [here](https://telegraf.js.org/classes/Telegraf-1.html#on-3) or your code editor will suggest you.

# Example

Here is an example how to use filters

```TS (Node)
import { message } from "telegraf/filters";

bot.on(message("text"), async (ctx, next) => {
  // next is added because other listners below this wont work if await next(); is not added
  await next();
});
```

### More Details

You can also add multiple listeners using array like given below:

```TS (Node)
bot.on([message("text"), message("photo")], async (ctx) => {
  ctx.reply("Received Text or Photo");
});
```

### `ctx.has` checks with filters

You can check if ctx has a filter like this.

```TS (Node)
if(ctx.has(message("text")){
ctx.reply("It is text");
}
else if(ctx.has(message("photo")){
ctx.reply("It is photo");
}
```
