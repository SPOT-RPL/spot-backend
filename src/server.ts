import app from "./app.ts";
import debug from "debug";

const port: number = Number(Bun.env.PORT ?? 3000);

const server = app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
})

function closeServer() {
	server.close(() => {
		debug('HTTP server closed');
	});
}

process.on('SIGINT', () => {
	debug('SIGINT signal received: closing HTTP server');
	closeServer();
});

process.on('SIGTERM', () => {
	debug('SIGTERM signal received: closing HTTP server');
	closeServer();
});
