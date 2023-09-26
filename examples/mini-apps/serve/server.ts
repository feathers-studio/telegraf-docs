import { join } from "node:path";
import express from "express";

const app = express();

app.use((req, res, next) => {
	console.log(req.method, req.url);
	return next();
});

app.use(express.static(join(__dirname, "public")));

app.listen(parseInt(process.env.PORT || "10000"), () =>
	console.log("Listening"),
);
