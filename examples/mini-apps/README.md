# Mini App examples

Telegram Mini Apps (formerly called Telegram Web Apps) allow opening a web app within Telegram, with some access to Telegram's features. Rather than normal web apps, Mini App are meant to add to the Telegram experience.

To start with, you must import the Telegram Web App script in your web application before your own JavaScript ([see example](./serve/public/index.html#L33)).

```HTML
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<script src="./my-script.js"></script>
```

This enables the `window.Telegram.WebApp` API in your application. You can use it like so;

```TS
const app = window.Telegram.WebApp;

// Call as soon as your page is ready for the user to see
app.ready();

// Expand your web app to full screen
app.expand();
```

For all available Web App features, see [Telegram's documentation](https://core.telegram.org/bots/webapps#initializing-mini-apps). TypeScript types for Telegram WebApp is available through the [`@types/telegram-web-app`](https://www.npmjs.com/package/@types/telegram-web-app) package. Simply installing it will enable it in the global scope.

There are 6 ways to launch Mini Apps:

- Keyboard Button [(see example)](./keyboard-button-mini-app.ts)
- Inline Keyboard Button [(see example)](./inline-keyboard-button-mini-app.ts)
- Menu Button [(see example)](./menu-button-mini-app.ts)
- Inline Mode [(see example)](./inline-mode-mini-app.ts)
- Direct Link [(see example)](./direct-link-mini-app.ts)
- Attachment Menu [(explanation)](#attachment-menu)

For all of the above methods, Telegram requires that you use a https URL for your Web App. The implication is that you cannot use localhost. However, you can test with http URLs on the test server. See [setup instructions](https://core.telegram.org/bots/webapps#testing-mini-apps). Once you have a test server token, you can simply enable it in Telegraf like so:

```TS
const bot = new Telegraf(testServerToken, { telegram: { testEnv: true } });
```

Just remember to switch back to your production token and remove `testEnv` when you deploy.

To test a Mini App without publishing a website yourself, try using this one: https://feathers.studio/telegraf/webapp/example ([source](./serve/public))

Depending on how you launch it, each type of Mini App has a slightly different set of abilities.

### Feature table

|                 | `initDataUnsafe` | `query_id` | `sendData` | `switchInlineQuery` | `chat_instance`, `chat_type`, `start_param` | `chat` |Private chat only|
| --------------- | ---------------- | ---------- | ---------- | ------------------- | ------------------------------------------- | ------ | ---------- |
| Keyboard button | ❌               | ❌         | ✅         | ❌                  | ❌                                          | ❌     | ✅     |
| Inline keyboard | ✅               | ✅         | ❌         | ❌                  | ❌                                          | ❌     | ✅     |
| Menu button     | ✅               | ✅         | ❌         | ❌                  | ❌                                          | ❌     | ✅     |
| Inline mode     | ❌               | ❌         | ❌         | ✅                  | ❌                                          | ❌     | ❌     |
| Direct link     | ✅               | ❌         | ❌         | ❌                  | ✅                                          | ❌     | ❌     |
| Attachment      | ✅               | ✅         | ❌         | ❌                  | ❌                                          | ✅     | ✅     |

Hence, we can come to the following conclusions:

1. Keyboard button Mini App can use `app.sendData` to communicate with the bot, and the sent data will be received on the bot's side as a service message:

   ```TS
   bot.on(message("web_app_data", async ctx => {
   	// assuming sendData was called with a JSON string
   	const data = ctx.webAppData.data.json();
   	// or if sendData was called with plaintext
   	const text = ctx.webAppData.data.text();
   }));
   ```

2. Other types of Mini Apps (except inline mode) must use `app.initData` to communicate with their own server. There is no way to directly send an update to your bot (such as `sendData`) this way. `initData` must be validated before being trusted. See [Validating `initData`](#validating-initdata). Once validated, `initData` contains a `query_id` which the server may use to call `answerWebAppQuery`.

   ```TS
   bot.telegram.answerWebAppQuery(validatedData.query_id, {
   	id: "0",
   	type: "article",
   	title: "Hello Mini App!",
   	input_message_content: {
   		message_text: "This message was sent from answerWebAppQuery",
   	},
   });
   ```

   If your application server is different from your bot server, you can still call `new Telegraf(token)` to create a bot instance to perform the above query, but do not call `bot.launch()`, which will cause your bot (which has already called launch) to self-destruct.

3. Inline mode Mini Apps can only switch back to inline mode and require the user to actively select a result.

### Attachment menu

This type of Mini App is only available to major advertisers on the Telegram Ad Platform. The last known information was that this requires an upfront deposit of at least $1M. You can however play with this feature on the test server. For more information, see [Telegram's docs](https://core.telegram.org/bots/webapps#launching-mini-apps-from-the-attachment-menu).

### Validating `initData`

```TS
// in the web app

window.addEventListener("ready", async function () {
	const data = await fetch(
		"/validate-init",
		{ method: "POST", body: app.initData },
	).then(res => res.json());
});
```

```TS
// on the server

import { createHmac } from "node:crypto";

function HMAC_SHA256(key: string | Buffer, secret: string) {
  return createHmac("sha256", key).update(secret);
}

function getCheckString(data: URLSearchParams) {
	const items: [k: string, v: string][] = [];

	// remove hash
	for (const [k, v] of data.entries()) if (k !== "hash") items.push([k, v]);

	return items.sort(([a], [b]) => a.localeCompare(b)) // sort keys
		.map(([k, v]) => `${k}=${v}`) // combine key-value pairs
		.join("\n");
}

app.post("/validate-init", (req, res) => {
	const data = new URLSearchParams(req.body);

	const data_check_string = getCheckString(data);
	const secret_key = HMAC_SHA256("WebAppData", process.env.BOT_TOKEN!).digest();
	const hash = HMAC_SHA256(secret_key, data_check_string).digest("hex");

	if (hash === data.get("hash"))
		// validated!
		return res.json(Object.fromEntries(data.entries()));

	return res.status(401).json({});
});
```
