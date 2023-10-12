# `Context` different shapes based on different requests

It's always recommended that you experiment and do a quick overview with different requests in case of an update to the core Telegram or Telegraf docs, it could be as simple as logging the `ctx` to the console:

```TS (Node)
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN); // Your bot token 

bot.use(ctx => {
  console.log(ctx);
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
```

these are a simple overview of what the `ctx` shape will look like or contain based on different situations/requests, feel free to utilize your browser search feature to find your specific `ctx` shape:

## Must know about the `Context` object

__Telegraf passes every request to your middlewares as a `ctx` object, and each `ctx` will always include these properties:__

- `update` and nested `update_id` inside of it; (`update` will also include additional properties based on the request, and probably is the field that you will find yourself working with most of the time)
- `telegram`
- `botInfo`
- `state`

```TS (Node)
  // The base shape of the ctx object

  {
    update: {
      update_id: number
    },
    telegram: {
      token: string,
      response: undefined /* differs based on the configuration */,
      options: {
        apiRoot: 'https://api.telegram.org',
        apiMode: 'bot',
        webhookReply: boolean,
        agent: [Agent],
        attachmentAgent: undefined /* differs based on the configuration */,
        testEnv: boolean
      }
    },
    botInfo: {
      id: number /* Your bot unique id */ ,
      is_bot: true,
      first_name: string,
      username: string,
      can_join_groups: boolean,
      can_read_all_group_messages: boolean,
      supports_inline_queries: boolean
    },
    state: {}
  }

```

## Specific Telegram message objects based on the type of the message

__Apart from text messages, Telegram has a bunch of different message types that users can share; Depending on the request, you will receive one or many of them inside your `update` property, nested inside another property like `message` or `channel_post` etc. Here are some of the most important message types that you might get inside the payload:__

- Sticker
```TS (Node)

  sticker: {
    "width": number,
    "height": number,
    "emoji": string /* e.g. "😂" */,
    "set_name": string /* The sticker pack name */,
    "is_animated": boolean,
    "is_video": boolean,
    "type": string /* e.g. "regular" etc. */,
    "thumbnail": {
      "file_id": string /* e.g. "AAMCBAADGQEAAgNdZRqJ2Kq_XCeyHHLUwUadueLpqc4AAhoRAAKVjflQoYfb2mrP1ZoBAAdtAAMwBA"*/,
      "file_unique_id": string /* e.g. "AQADGhEAApWN-VBy" */,
      "file_size": number,
      "width": number,
      "height": number
    },
    "thumb": {
      "file_id": string,
      "file_unique_id": string,
      "file_size": number,
      "width": number,
      "height": number
    },
    "file_id": string,
    "file_unique_id": string,
    "file_size": number
  }

```

- GIF
```TS (Node)
  // A GIf has both of these properties available

  animation: {
    "mime_type": string /* e.g. "video/mp4" */,
    "duration": number,
    "width": number,
    "height": number,
    "thumbnail": {
        "file_id": string,
        "file_unique_id": string,
        "file_size": number,
        "width": number,
        "height": number
    },
    "thumb": {
        "file_id": string,
        "file_unique_id": string,
        "file_size": number,
        "width": number,
        "height": number
    },
    "file_id": string,
    "file_unique_id": string,
    "file_size": number
  },
  document: {
    "mime_type": string,
    "thumbnail": {
        "file_id": string,
        "file_unique_id": string,
        "file_size": number,
        "width": number,
        "height": number
    },
    "thumb": {
        "file_id": string,
        "file_unique_id": string,
        "file_size": number,
        "width": number,
        "height": number
    },
    "file_id": string,
    "file_unique_id": string,
    "file_size": number
  }

```

- File/document
```TS (Node)

  document: {
    "file_name": string,
    "mime_type": string /* e.g. "application/zip" */,
    "file_id": string,
    "file_unique_id": string,
    "file_size": number,
  }

```

- Audio
```TS (Node)

  audio: {
    "duration": number /* In seconds */,
    "file_name": string,
    "mime_type": string /* e.g. "audio/mpeg" */,
    "title": string,
    "thumbnail": {
        "file_id": string,
        "file_unique_id": string,
        "file_size": number,
        "width": number,
        "height": number
    },
    "thumb": {
        "file_id": string,
        "file_unique_id": string,
        "file_size": number,
        "width": number,
        "height": number
    },
    "file_id": string,
    "file_unique_id": string,
    "file_size": number,
  }

```

- Voice
```TS (Node)

  voice: {
    "duration": number /* In seconds */,
    "mime_type": string /* e.g. "audio/mpeg" */,
    "file_id": string,
    "file_unique_id": string,
    "file_size": number,
  }

```

- Photo

> the `photo` array containing multiple objects isn't a sign of multiple photos, but a single photo with different sizes indicating thumbnails etc.

```TS (Node)

  photo: [
    {
        "file_id": string,
        "file_unique_id": string,
        "file_size": number,
        "width": number,
        "height": number
    },
    {
        "file_id": string,
        "file_unique_id": string,
        "file_size": number,
        "width": number,
        "height": number
    },
    {
        "file_id": string,
        "file_unique_id": string,
        "file_size": number,
        "width": number,
        "height": number
    },
    {
        "file_id": string,
        "file_unique_id": string,
        "file_size": number,
        "width": number,
        "height": number
    }
  ]

```

- Video
```TS (Node)

 video: {
    "duration": number /* In seconds */,
    "width": number,
    "height": number,
    "file_name": string,
    "mime_type": string /* e.g. "video/mp4" */,
    "thumbnail": {
        "file_id": string ,
        "file_unique_id": string,
        "file_size": number,
        "width": number,
        "height": number
    },
    "thumb": {
        "file_id": string ,
        "file_unique_id": string,
        "file_size": number,
        "width": number,
        "height": number
    },
    "file_id": string ,
    "file_unique_id": string,
    "file_size": number,
  }

```


## Scenario 1: The user is interacting with your bot in your bot private chat

> __As previously said, some properties will always be present; In order to prevent writing boilerplate codes, we will only highlight the properties inside the `update` property without `update_id`, since it's always present.__

#### User sends a text message

```TS (Node)
  {
    message: {
      message_id: number,
      from: {
        "id": number /* User Telegram number id */,
        "is_bot": boolean,
        "first_name": string,
        "username": string /* User Telegram id that starts with @ */,
        "language_code": string /* e.g. "en" */
      },
      chat: {
        "id": number,
        "first_name": string,
        "username": string /* User Telegram id that starts with @ */,
        "type": string /* e.g. "private" */
      },
      date: number /* Unix/Epoch based date */,
      text: string /* The message that your user sent */
    }
  },
``` 

#### User sends a sticker

```TS (Node)
  {
    message: {
      message_id: number,
      from: [Object] /* Stays the same in this scenario */,
      chat: [Object] /* Stays the same in this scenario */,
      date: number /* Unix/Epoch based date */,
      sticker: [Object] /* refer to ## Specific Telegram message objects based on the type of the message */
    }
  },
```

#### User sends a GIF

```TS (Node)
  {
    message: {
      message_id: number,
      from: [Object] /* Stays the same in this scenario */,
      chat: [Object] /* Stays the same in this scenario */,
      date: number /* Unix/Epoch based date */,
      animation: [Object] /* refer to ## Specific Telegram message objects based on the type of the message */,
      document: [Object] /* refer to ## Specific Telegram message objects based on the type of the message */,
    }
  },
```

#### User sends a file

```TS (Node)
  {
    message: {
      message_id: number,
      from: [Object] /* Stays the same in this scenario */,
      chat: [Object] /* Stays the same in this scenario */,
      date: number /* Unix/Epoch based date */,
      document: [Object] /* refer to ## Specific Telegram message objects based on the type of the message */,
    }
  },
```

#### User forwards a message from another user

```TS (Node)
  {
    message: {
      message_id: number,
      from: [Object] /* Stays the same in this scenario */,
      chat: [Object] /* Stays the same in this scenario */,
      date: number /* Unix/Epoch based date */,
      forward_from: {
        "id": number,
        "is_bot": boolean,
        "first_name": string,
        "last_name": string,
        "username": string /* User Telegram id that starts with @ */
      },
      forward_date: number /* Unix/Epoch based date of the message when it originally was sent */,
      text: string,
      entities: [
        {
            "offset": number,
            "length": number,
            "type": string /* e.g. "code" etc. */
        }
      ] /* Entities will only be received in case of a: mention, code etc. and are not specific to forwarding messages */
    }
  },
```

## Scenario 2: The user is still interacting with your bot in your bot private chat, but is forwarding messages from a channel

#### User forwards a channel text message/post

```TS (Node)
  {
    message: {
      message_id: number,
      from: [Object] /* Stays the same in this scenario */,
      chat: [Object] /* Stays the same in this scenario */,
      date: number /* Unix/Epoch based date */,
      forward_from_chat: {
        "id": number /* Channel unique id */,
        "title": string,
        "username": string /* Channel id that starts with @ */,
        "type": string /* e.g. "channel" etc. */
      },
      forward_from_message_id: number /* Original id of the message in the channel */,
      forward_signature: string /* Optional: Will only be received if the channel had admins signature turned on when posting this message */,
      forward_date: number /* Original Unix/Epoch based date of the message */,
      text: string,
      entities: [
        {
            "offset": number,
            "length": number,
            "type": string
        }
      ] /* Entities will only be received in case of a: mention, code etc... */
    }
  }
```

#### User forwards a channel message/post that's also a forward from another channel

> Caveat: In this situation, the `forward_signature` field will be lost even if the original message in the channel has a `forward_signature`

```TS (Node)
  {
    message: {
      message_id: number,
      from: [Object] /* Stays the same in this scenario */,
      chat: [Object] /* Stays the same in this scenario */,
      date: number /* Unix/Epoch based date */,
      forward_from_chat: [Object],
      forward_from_message_id: number /* Original message id */,
      forward_date: number /* Unix/Epoch based date */,
      photo: [Array] /* This forwarded message contained photos */,
      caption: string,
      caption_entities: [Array]
    }
  }
```

#### User forwards a channel audio message

> Caveat: due to Telegram implementations, forwarding audio messages does not count as a forward and fields like `forward_from_chat`, `forward_from_message_id`, `forward_signature`, `forward_date` and other possible forward-related fields will not be accessible

```TS (Node)
  {
    message: {
      audio: [Object] /* refer to ## Specific Telegram message objects based on the type of the message */
      message_id: number,
      from: [Object] /* Stays the same in this scenario */,
      chat: [Object] /* Stays the same in this scenario */,
      date: number /* Unix/Epoch based date */,
      caption: string,
      caption_entities: [Array]
    }  
  }
```

#### User forwards a channel voice message/post

```TS (Node)
  {
    message: {
      message_id: number,
      from: [Object] /* Stays the same in this scenario */,
      chat: [Object] /* Stays the same in this scenario */,
      date: number /* Unix/Epoch based date */,
      forward_from_chat: [Object] /* Stays the same in this scenario */ ,
      forward_from_message_id: number /* Original id of the message in the channel */,
      forward_signature: string /* Optional: Will only be received if the channel had admins signature turned on when posting this message */,
      forward_date: number /* Original Unix/Epoch based date of the message */,
      voice: [Object] /* refer to ## Specific Telegram message objects based on the type of the message */,
      caption: string,
      caption_entities: [Array] /* Entities will only be received in case of a: mention, code etc... */
    }
  },
```

#### User forwards a channel file message/post

```TS (Node)
  {
    message: {
      message_id: number,
      from: [Object] /* Stays the same in this scenario */,
      chat: [Object] /* Stays the same in this scenario */,
      date: number /* Unix/Epoch based date */,
      forward_from_chat: [Object] /* Stays the same in this scenario */,
      forward_from_message_id: number /* Original id of the message in the channel */,
      forward_signature: string /* Optional: Will only be received if the channel had admins signature turned on when posting this message */,
      forward_date: number /* Original Unix/Epoch based date of the message */,
      text: string,
      document: [Object] /* refer to ## Specific Telegram message objects based on the type of the message */,
      caption: string /* Optional: Will only be received if the file has a description/caption */,
      caption_entities: [Array] /* Entities will only be received in case of a: mention, code etc... */
    } 
  }
```

## Scenario 3: Your bot is receiving channel updates as a channel admin

### The first time your bot joins the channel

```TS (Node)
  {
    my_chat_member: {
      chat: {
        "id": number /* Channel unique number id */,
        "title": string /* Channel title/name */,
        "type": string /* e.g. "channel" */
      },
      from: {
        "id": number,
        "is_bot": boolean,
        "first_name": string,
        "username": string,
        "language_code": string /* e.g. "en" */
      },
      date: number /* Unix/Epoch based date */
      old_chat_member: {
        "user": {
          "id": number,
          "is_bot": boolean,
          "first_name": string,
          "username": string
        },
        "status": string /* e.g. "left" */
      },
      new_chat_member: {
        "user": {
          "id": number,
          "is_bot": boolean,
          "first_name": string,
          "username": string
        },
        "status": string /* e.g. "administrator" */,
        "can_be_edited": boolean,
        "can_manage_chat": boolean,
        "can_change_info": boolean,
        "can_post_messages": boolean,
        "can_edit_messages": boolean,
        "can_delete_messages": boolean,
        "can_invite_users": boolean,
        "can_restrict_members": boolean,
        "can_promote_members": boolean,
        "can_manage_video_chats": boolean,
        "can_post_stories": boolean,
        "can_edit_stories": boolean,
        "can_delete_stories": boolean,
        "is_anonymous": boolean,
        "can_manage_voice_chats": boolean
      }
    }
  }
```

### A new text message has been sent (with "Sign messages" being turned "off" in channel settings)

> If "Sign messages" is turned on, you will receive an additional property in the `channel_post` property, named `author_signature` of value type `string`

```TS (Node)
  {
    channel_post: {
      author_signature: string /* Optional */,
      message_id: number,
      sender_chat: {
        "id": number,
        "title": string,
        "type": string
      },
      chat: [Object] /* Stays the same */,,
      date: number /* Unix/Epoch based date */,
      text: string
    }
  }
```

### A new media or multi-media has been sent

> Every multi-media post/message, although grouped together, are considered different requests and will be received individually; But they will contain a unique `media_group_id` property present in the `channel_post` property, of value type `string`

```TS (Node)
  {
    channel_post: {
      /* Everything stays the same as above but with possible additional properties like a photo, video or audio field; These fields types and properties are available in ## Specific Telegram message objects based on the type of the message */,
      caption: string, /* Only present if the media has a caption/description */
      media_group_id: string /* Only present if it's a multi-media post; e.g. "13569976556660260" */,
    }  
  }
```
