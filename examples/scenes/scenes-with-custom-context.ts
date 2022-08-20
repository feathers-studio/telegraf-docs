import { Context, Scenes, session, Telegraf } from "telegraf";

/**
 * We can define our own context object.
 *
 * We have to set the scene object under the `scene` property.
 */
interface MyContext extends Context {
	// will be available under `ctx.myContextProp`
	myContextProp: string;

	// declare scene type
	scene: Scenes.SceneContextScene<MyContext>;
}

// Handler factories
const { enter, leave } = Scenes.Stage;

// Greeter scene
const greeterScene = new Scenes.BaseScene<MyContext>("greeter");
greeterScene.enter(ctx => ctx.reply("Hi"));
greeterScene.leave(ctx => ctx.reply("Bye"));
greeterScene.hears("hi", enter<MyContext>("greeter"));
greeterScene.on("message", ctx => ctx.replyWithMarkdown("Send `hi`"));

// Echo scene
const echoScene = new Scenes.BaseScene<MyContext>("echo");
echoScene.enter(ctx => ctx.reply("echo scene"));
echoScene.leave(ctx => ctx.reply("exiting echo scene"));
echoScene.command("back", leave<MyContext>());
echoScene.on("text", ctx => ctx.reply(ctx.message.text));
echoScene.on("message", ctx => ctx.reply("Only text messages please"));

const bot = new Telegraf<MyContext>(token);

const stage = new Scenes.Stage<MyContext>([greeterScene, echoScene], {
	ttl: 10,
});
bot.use(session());
bot.use(stage.middleware());
bot.use((ctx, next) => {
	// we now have access to the the fields defined above
	ctx.myContextProp ??= "";
	return next();
});
bot.command("greeter", ctx => ctx.scene.enter("greeter"));
bot.command("echo", ctx => ctx.scene.enter("echo"));
bot.on("message", ctx => ctx.reply("Try /echo or /greeter"));
bot.launch();
