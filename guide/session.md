# Working with session

By default, Telegraf does not know if two requests from the same user were related (each request even from the same user, are handled separately). This is where session comes in; Similar to sessions in a web server, Telegraf's session is a store used to associate data with a chat or user.

Telegraf sessions are also important for Scenes and Wizards, which internally use session to store the current state of the user.

## Using session

To use Telegraf's session, import the built-in session middleware and pass it to the bot:

```TS (Node)
import { Telegraf, session } from "telegraf";

const bot = new Telegraf(token);
bot.use(session());

// Session is ready to use!
```

This will add session as a property to the `Context` object. If you're using Typescript, you can augment the default `Context` type and get additional type safety based on the shape of your session object: 

```TS (Node)
import { Telegraf, session, type Context } from "telegraf";
import type { Update } from "telegraf/types";

interface MyContext <U extends Update = Update> extends Context<U> {
	session: {
		count: number
	},
};

// Telegraf constructor accepts a custom Context type
const bot = new Telegraf<MyContext>(token);
// It's also possible to set a default property and value on the session store:
bot.use(session({ defaultSession: () => ({ count: 0 }) }));

bot.use(ctx => {
	// You can now leverage the provided Typescript IntelliSense when accessing the session with ctx.session
});
```

## Persistent sessions

The default `session` middleware in Telegraf is backed by an in-memory store. For some use cases this can be sufficient; However, if your bot restarts, all session data will be lost. This could be frustrating for users that completed multiple steps and now have to restart again. To avoid this issue, we must back our session with a real database. This can be done by installing and importing `@telegraf/session` with a database of choice ([see options](https://github.com/telegraf/session#readme)). We'll use Redis in this example, but head over to [`@telegraf/session`](https://github.com/telegraf/session#readme) docs for other options (SQLite, MongoDB, MySQL, Postgres, etc).

```TS
import { Redis } from "@telegraf/session/redis";

const store = Redis({
	// Assuming you're using a locally installed Redis daemon running on port 6379
	url: "redis://127.0.0.1:6379",
});

// Pass the store to the session
bot.use(session({ store }));
```

## How to use session safely

Seasoned Telegraf users may remember this issue [#1372](https://github.com/telegraf/telegraf/issues/1372), which caused the session functionality to be deprecated for a while due to the potential for race conditions. This was fixed in Telegraf 4.12.0 ([#1713](https://github.com/telegraf/telegraf/pull/1713)). However, we must review the safety gaurds that new session functionality provides, and how not to step out of them.

Things to remember:

1. Always `await` any async API calls, `next()` handlers or use a `return` statement in your middlewares.

   ```TS (Node)
   bot.on("message", async ctx => {
   	// ❌ BAD! You did not await ctx.reply()
   	ctx.reply("Hello there!");

   	// ✅ Good, you awaited your requests.
   	await ctx.reply("Hello there!");

   	// make sure to "await" any other async calls you may make
   	const res = await fetch(API_URL);

		// Make sure to "await" next() handlers
		await next();

   	// Returning calls is also okay, because the promise will be returned
   	return ctx.sendAnimation(GOOD_MORNING_GIF);
   });
   ```

2. Normally, Telegraf will try to save any changes to the `ctx.session` in the session store, after all middlewares are done processing. However, if a parallel update has made changes to the session store, those changes will also be saved.

   ```TS (Node)
   bot.use(async (ctx, next) => {
   	ctx.session.count++; // Increments the value once
   	return next(); // Passes control to the next middleware
   });

   bot.on("message", async (ctx, next) => {
   	ctx.session.count++; // increments the value again
   });

   // All middleware are run and ctx.session will be written back to the store
   ```

3. Session store changes will be saved even if a middleware errors. If you need to roll back data changes on an error, you must handle errors properly and then fix your session data.

   ```TS (Node)
   bot.use(async (ctx, next) => {
   	ctx.session.count++; // increment count
   	await functionThatThrows();
   	return next();
   });

   // Incremented count will still be written to store even though there is an uncaught error in the previous middleware

   ```

4. If your bot is on webhook mode, you must disable `webhookReply`.

   ```TS (Node)
   const bot = new Telegraf(token, { telegram: { webhookReply: false } })
   ```

5. You must not introduce race-conditions of your own. Be wary of writing stale data to the session store:

   ```TS (Node)
   bot.on(message("text"), async ctx => {
   	// Reading value from session
   	const count = ctx.session.count;

   	const response = await fetch(API_URL, { body: count });

   	// ⚠️ WARNING! You are writing stale value to the session.
   	// Another request may have updated this session property while you awaited the fetch request, be careful of additional or unwanted changes
   	ctx.session.count = count + 1;

   	// ✅ Good, you are changing the value based on a immediate reading
   	ctx.session.count = ctx.session.count + 1;
   });
   ```

##### Note: Telegraf's session safety does not currently work with long-polling mode using NodeJS clusters or other means of threading (workers, etc.). It will however work fine with single-instance long-polling, or multi-instance webhook mode.
