const app = window.Telegram.WebApp;
const storage = app.CloudStorage;

app.ready();
app.expand();

const [errorer, btn, reset, count] = [
	/** @type {HTMLParagraphElement} */ (document.getElementById("errors")),
	/** @type {HTMLButtonElement} */ (document.getElementById("click")),
	/** @type {HTMLButtonElement} */ (document.getElementById("reset")),
	/** @type {HTMLParagraphElement} */ (document.getElementById("count")),
];

/** @param e {any} */
const setError = e =>
	(errorer.innerText += "\n" + JSON.stringify(e, null, "\t"));

window.addEventListener("error", e => setError(e.toString()));

/** @param error {string | null} @param value {string | undefined} */
const parse = (error, value) => (!error ? (value ? parseInt(value) : 0) : 0);

storage.getItem("clicks", (error, value) => {
	if (error) return setError({ error, type: typeof error, value });
	btn.removeAttribute("disabled");

	const c = parse(error, value);
	count.innerText = `Clicked ${c} times`;
});

btn.addEventListener("click", () => {
	btn.setAttribute("disabled", "");
	storage.getItem("clicks", (error, value) => {
		if (error) return setError({ error, type: typeof error, value });
		const c = parse(error, value) + 1;
		storage.setItem("clicks", String(c), (error, success) => {
			if (error) return setError({ error, type: typeof error, success });
			count.innerText = `Clicked ${c} times`;
			btn.removeAttribute("disabled");
		});
	});
});

reset.addEventListener("click", () => {
	storage.removeItem("clicks", (error, success) => {
		if (error) return setError({ error, type: typeof error, success });
		count.innerText = `Count was reset!`;
		btn.removeAttribute("disabled");
	});
});

export {};
