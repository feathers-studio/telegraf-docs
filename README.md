# Telegraf docs

This repo will house the future of Telegraf's documentation. For now, it houses bot examples.

## How to use these examples:

In the interest of brevity, the examples in the repo don't explain certain good-to-haves.

### Graceful stop

On NodeJS, to make sure connections are gracefully closed before process is killed, you can use the `process.once` hooks. This is safe to add to the end of your bot's entry file.

```TS
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
```

### Secrets

This section talks about how to pass variables like token, port, webhook domain to the bot.

The recommendation is to pass them via environment variables and not directly include them in code. This is especially true for sensitive secrets such as token. This should probably be added before calling `new Telegraf()`.

```TS
const {
	PORT,
	BOT_TOKEN: token,
	WEBHOOK_DOMAIN: webhookDomain,
} = process.env;

// default to port 3000 if PORT is not set
const port = Number(PORT) || 3000;

// assert and refuse to start bot if token or webhookDomain is not passed
if (!token) throw new Error('"WEBHOOK_URL" env var is required!');
if (!webhookDomain) throw new Error('"BOT_TOKEN" env var is required!');
```

> **Important note**: Only use the vars needed for your bot. If you don't use webhooks, you don't need WEBHOOK_DOMAIN or the corresponding assertion.

Different deployment methods may have their own ways to pass environment variables. If you deploy to a Function-as-a-Service host such as Heroku, Netlify, AWS Lambda, GCP Functions, use the platform-specific way to set the correct environment variables.

If you use a conventional server, you can use the npm package `"dotenv"` to load vars from an `.env` file. Place this file in root and <u>**don't forget**</u> to add this file to `.gitignore`:

```yaml
# .env
PORT=3000
WEBHOOK_DOMAIN=bot.example.com
BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
```
