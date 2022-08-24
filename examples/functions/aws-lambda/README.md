# Telegraf on AWS Lambda

This template demonstrates how to run a simple Telegraf echo bot with on AWS Lambda and API Gateway using the Serverless Framework.

## Usage

After installing dependencies (using `npm install` or the similar), the following commands are available:

```shell
npm run serverless # alias for the serverless binary
npm run release
npm run purge
npm run set-webhook
```

After running `npm run release`, you must copy the full URL it prints and run:

```shell
npm run set-webhook -- -t $BOT_TOKEN -D '{ "url": $FULL_URL_TO_FUNCTION }'
```

If you publish to AWS Lambda with a CI, you can run this npm script from your CI instead.

For more details, consult the [serverless framework documentation](https://www.serverless.com).
