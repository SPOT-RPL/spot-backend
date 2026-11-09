import app from "./app.ts";

const port: number = Bun.env.PORT ?? 3000;

app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
})
