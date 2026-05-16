import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(scriptDir, '../docs');
const outputFile = path.join(distDir, 'urls-to-cache.json');

if (!fs.existsSync(distDir)) {
	throw new Error(`Build output not found: ${distDir}`);
}

const urlsToCache = new Set();

function shouldCache(filePath) {
	const fileName = path.basename(filePath);
	return fileName !== '.DS_Store';
}

function addUrlVariants(relativePath) {
	const normalized = relativePath.replace(/\\/g, '/');

	if (normalized === 'index.html') {
		urlsToCache.add('/');
		urlsToCache.add('/index.html');
		return;
	}

	if (normalized.endsWith('/index.html')) {
		const routePath = `/${normalized.slice(0, -'index.html'.length)}`;
		urlsToCache.add(routePath);
		urlsToCache.add(routePath.endsWith('/') ? routePath.slice(0, -1) : routePath);
		urlsToCache.add(`/${normalized}`);
		return;
	}

	if (normalized.endsWith('.html')) {
		urlsToCache.add(`/${normalized}`);
		urlsToCache.add(`/${normalized.slice(0, -'.html'.length)}`);
		return;
	}

	urlsToCache.add(`/${normalized}`);
}

function walkDir(dirPath) {
	for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
		const entryPath = path.join(dirPath, entry.name);

		if (entry.isDirectory()) {
			walkDir(entryPath);
			continue;
		}

		if (!shouldCache(entryPath)) {
			continue;
		}

		const relativePath = path.relative(distDir, entryPath);
		addUrlVariants(relativePath);
	}
}

walkDir(distDir);

fs.writeFileSync(outputFile, JSON.stringify([...urlsToCache].sort(), null, 2) + '\n');
console.log(`Generated cache list at ${outputFile}`);
