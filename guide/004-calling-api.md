# `[004]` **Calling API**

In Telegraf, it is possible to call all the possible api methods using `bot.telegram.*`

<em>\* here refers to `methodName`</em>

### **How APIs are called**

Telegraf sends request to Bot API and Telegraf supports all the methods available for **Bot API**.

**Bot API** further calls the **MtProto** Server to send that request to **Telegram**'s **Servers**.

**MtProto** contains more methods and data than **Bot API**.

> Note: **Telegraf** only Supports **Bot API** and its methods.
