const app = window.Telegram.WebApp;
const storage = app.CloudStorage;

app.expand();

const [errorer, btn, reset, count] = [
	/** @type {HTMLParagraphElement} */ (document.getElementById("errors")),
	/** @type {HTMLButtonElement} */ (document.getElementById("click")),
	/** @type {HTMLButtonElement} */ (document.getElementById("reset")),
	/** @type {HTMLParagraphElement} */ (document.getElementById("count")),
];

/** @param e {any} */
const setError = e => (errorer.innerText += "\n" + JSON.stringify(e));

window.addEventListener("error", e => setError(e));

storage.getItem("clicks", (err, val) => {
	btn.removeAttribute("disabled");
	if (!err) {
		const c = !err ? (val ? parseInt(val) : 0) : 0;
		count.innerText = `Clicked ${c} times`;
	}
});

btn.addEventListener("click", () => {
	btn.setAttribute("disabled", "");
	storage.getItem("clicks", (error, value) => {
		if (error) setError({ error, type: typeof error, value });
		const c = (!error ? (value ? parseInt(value) : 0) : 0) + 1;
		storage.setItem("clicks", String(c), (error, success) => {
			if (error) setError({ error, type: typeof error, success });
			count.innerText = `Clicked ${c} times`;
			btn.removeAttribute("disabled");
		});
	});
});

reset.addEventListener("click", () => {
	storage.removeItem("clicks", (error, success) => {
		if (error) setError({ error, type: typeof error, success });
		count.innerText = `Count was reset!`;
		btn.removeAttribute("disabled");
	});
});
