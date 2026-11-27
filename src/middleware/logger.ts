import morgan from "morgan";
import chalk, { type ChalkInstance } from "chalk";

export const logger = morgan(function(tokens, req, res) {
	const status = ((code: number) => {
		if (code >= 500) return chalk.red(code);
		if (code >= 400) return chalk.yellow(code);
		if (code >= 300) return chalk.cyan(code);
		if (code >= 200) return chalk.green(code);
		return chalk.white(code);
	})(res.statusCode);

    const colors: Record<string, ChalkInstance> = {
        GET: chalk.green,
        POST: chalk.blue,
        PUT: chalk.yellow,
        PATCH: chalk.magenta,
        DELETE: chalk.red,
    };

	const method = (colors[req.method!] || chalk.white)(req.method!)

	return [
		"[" + tokens!["date"]!(req, res, "iso") + "]",
		tokens!["remote-addr"]!(req, res),
		method,
		tokens!["url"]!(req, res),
		status,
		tokens!["response-time"]!(req, res),
		"ms",
		"-",
		tokens!["res"]!(req, res, "content-length"),
	].join(' ');
});
