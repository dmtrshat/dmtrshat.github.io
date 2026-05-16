// @ts-check
import { execFile } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { defineConfig } from "astro/config";

const execFileAsync = promisify(execFile);
const rootDir = fileURLToPath(new URL(".", import.meta.url));
const grimoireConfigPath = path.resolve(
	rootDir,
	"grimoire/config/grimoire.config.json",
);
const grimoireConfig = JSON.parse(readFileSync(grimoireConfigPath, "utf-8"));
const grimoireWatchPaths = new Set(getGrimoireWatchPaths(grimoireConfig));
const buildGrimoireCss = createGrimoireBuildRunner();

function getGrimoireWatchPaths(config) {
	const watchPaths = new Set([grimoireConfigPath]);

	for (const project of config.projects ?? []) {
		for (const inputPath of project.inputPaths ?? []) {
			watchPaths.add(path.resolve(rootDir, inputPath));
		}
	}

	for (const criticalEntry of config.critical ?? []) {
		for (const stylePath of criticalEntry.styles ?? []) {
			if (typeof stylePath !== "string") continue;
			if (!stylePath.startsWith("./") && !stylePath.startsWith("../")) continue;
			watchPaths.add(path.resolve(rootDir, stylePath));
		}
	}

	return [...watchPaths];
}

function createGrimoireBuildRunner() {
	let activeBuild = null;
	let rerunRequested = false;

	async function runBuild() {
		try {
			await execFileAsync("grim", ["build"], { cwd: rootDir });
		} catch (error) {
			const stderr = typeof error?.stderr === "string" ? error.stderr.trim() : "";
			const stdout = typeof error?.stdout === "string" ? error.stdout.trim() : "";
			throw new Error(stderr || stdout || "grim build failed");
		}
	}

	return async function ensureBuilt() {
		if (activeBuild) {
			rerunRequested = true;
			await activeBuild;
			return;
		}

		activeBuild = runBuild();

		try {
			await activeBuild;
		} finally {
			activeBuild = null;

			if (rerunRequested) {
				rerunRequested = false;
				await ensureBuilt();
			}
		}
	};
}

function grimoireCssReloadPlugin() {
	return {
		name: "grimoire-css-reload",
		apply: "serve",
		async buildStart() {
			await buildGrimoireCss();
		},
		configureServer(server) {
			server.watcher.add([...grimoireWatchPaths]);

			server.watcher.on("all", async (_eventName, changedPath) => {
				const resolvedChangedPath = path.resolve(changedPath);

				if (!grimoireWatchPaths.has(resolvedChangedPath)) {
					return;
				}

				try {
					await buildGrimoireCss();
					server.ws.send({ type: "full-reload", path: "*" });
				} catch (error) {
					server.config.logger.error(
						`[grimoire-css-reload] ${error instanceof Error ? error.message : String(error)}`,
					);
				}
			});
		},
	};
}

function grimoireCssIntegration() {
	return {
		name: "grimoire-css",
		hooks: {
			"astro:build:start": async () => {
				await buildGrimoireCss();
			},
		},
	};
}

// https://astro.build/config
export default defineConfig({
	outDir: "./docs",
	integrations: [grimoireCssIntegration()],
	vite: {
		plugins: [grimoireCssReloadPlugin()],
	},
});
