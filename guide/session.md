# Working with session

By default, Telegraf does not know if two request from the same user were related. That's where session comes in. Similar to sessions in webservers, session is a store used to associate some data with a chat or user.

Telegraf sessions are also important for Scenes and Wizards, which internally use session to store the current state of the user.

## Using session

To use session in Telegraf, import the builtin session middleware, like so:

```TS (Node)
import { Telegraf, session } from "telegraf";

const bot = new Telegraf(token);
bot.use(session());

// session is ready to use!
```

This attaches ctx.session to the context object. To let Typescript know about this, we want to augment the Context type:

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
// we can also set a default value for session:
bot.use(session({ defaultSession: () => ({ count: 0 }) }));

bot.use(ctx => {
	// ctx.session is available
});
```

## Persistent sessions

The default `session` middleware in Telegraf is backed by an in-memory store. Sometimes this is sufficient, but if your bot restarts you will lose all session data. This can be bad, because your users may need to start over again. To avoid this, we must back our session with a real database. This can be done by installing `@telegraf/session` and a database of choice ([see options](https://github.com/telegraf/session#readme)). We'll use Redis in this example, but go over to [`@telegraf/session`](https://github.com/telegraf/session#readme) docs for other options (SQLite, MongoDB, MySQL, Postgres, etc).

```TS
import { Redis } from "@telegraf/session/redis";

const store = Redis({
	// this assumes you're using a locally installed Redis daemon running at 6379
	url: "redis://127.0.0.1:6379",
});

// pass the store to session
bot.use(session({ store }));
```

## How to use session safely

Seasoned Telegraf users may remember [#1372](https://github.com/telegraf/telegraf/issues/1372) and that session was deprecated for a while due to the potential for race conditions. This was fixed in Telegraf 4.12.0 ([#1713](https://github.com/telegraf/telegraf/pull/1713)). However, we must review the safeties that new session provides, and how not to step out of it.

Things to remember:

1. Always `await` or return any async API calls (or `next()`) in your middlewares.

   ```TS (Node)
   bot.on("message", async ctx => {
   	// ❌ BAD! You did not await ctx.reply()
   	ctx.reply("Hello there!");

   	// ✅ Good, you awaited your requests.
   	await ctx.reply("Hello there!");

   	// Also applies to any other async calls you may make:
   	const res = await fetch(API_URL);

   	// Returning calls is also okay, because the promise will be returned
   	return ctx.sendAnimation(GOOD_MORNING_GIF);
   });
   ```

2. If you write to `ctx.session` at any point, normally Telegraf will try to persist it after all middlewares are done. However, if a parallel update has made changes to session, those changes will also be written.

   ```TS (Node)
   bot.use(async (ctx, next) => {
   	ctx.session.count++; // increment once
   	return next(); // pass control to next middleware
   });

   bot.on("message", async (ctx, next) => {
   	ctx.session.count++; // increment again
   });

   // all middleware have run. ctx.session will be written back to store
   ```

3. Session will write to store even if a middleware errors. If you need to roll data back on an error, you must handle the error and fix your session data.

   ```TS (Node)
   bot.use(async (ctx, next) => {
   	ctx.session.count++; // increment count
   	await functionThatThrows();
   	return next();
   });

   // incremented count will still be written to store

   ```

4. If you use webhook mode, you must disable `webhookReply`.

   ```TS (Node)
   const bot = new Telegraf(token, { telegram: { webhookReply: false } })
   ```

5. You must not introduce race-conditions of your own. Be wary of writing stale data back to session. Example:

   ```TS (Node)
   bot.on(message("text"), async ctx => {
   	// reading value from session
   	const count = ctx.session.count;

   	const response = await fetch(API_URL, { body: count });

   	// ⚠️ WARNING! You wrote stale value to session.
   	// Another request may have updated session while you awaited fetch, be careful of that
   	ctx.session.count = count + 1;

   	// ✅ Good, you wrote immediately after reading
   	ctx.session.count = ctx.session.count + 1;
   });
   ```

##### Note: Telegraf's session safety will not currently work with long-polling using NodeJS clusters or other means of threading (workers, etc.). It will however work fine with single-instance long-polling, or multi-instance webhook mode.
