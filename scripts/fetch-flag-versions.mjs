#!/usr/bin/env node
// Downloads the other versions of national flags (state, civil, alternative...) from Wikimedia Commons.
//
//   node scripts/fetch-flag-versions.mjs            all of scripts/flag-versions.json
//   node scripts/fetch-flag-versions.mjs BOL-civil  just these
//
// For each file it asks the Commons API for the first title in the list that exists, downloads the original
// SVG, checks its SHA-1 against the one Commons reports, and saves it as flag-atlas/flags/<file>.svg. Where
// it came from (file page, licence, author) goes in flag-atlas/flags/VERSION-SOURCES.md. When no title
// exists it searches Commons and prints what it found, downloads nothing for that file, and exits with 1.
// Needs Node 18 or later (for fetch).
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = join(ROOT, 'scripts', 'flag-versions.json');
const FLAGS = join(ROOT, 'flag-atlas', 'flags');
const SOURCES = join(FLAGS, 'VERSION-SOURCES.md');
const API = 'https://commons.wikimedia.org/w/api.php';
// Wikimedia asks every script to say who it is: https://meta.wikimedia.org/wiki/User-Agent_policy
const UA = 'GeographyTools-flag-versions/1.0 (https://github.com/peejerator/Geography-Tools)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function api(params) {
	const url = `${API}?${new URLSearchParams({ format: 'json', formatversion: '2', origin: '*', ...params })}`;
	const res = await fetch(url, { headers: { 'User-Agent': UA } });
	if (!res.ok) throw new Error(`Commons API: HTTP ${res.status} for ${url}`);
	return res.json();
}
const stripHtml = (s = '') => s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

// The first of the titles that exists on Commons, with its download URL, SHA-1 and licence
async function resolve(titles) {
	const data = await api({
		action: 'query',
		redirects: '1',
		prop: 'imageinfo',
		iiprop: 'url|sha1|mime|extmetadata',
		titles: titles.map((t) => 'File:' + t).join('|'),
	});
	const pages = data.query?.pages ?? [];
	// follow the API's renames (normalized, then redirects) so each asked-for title finds its page
	const rename = new Map();
	for (const n of [...(data.query?.normalized ?? []), ...(data.query?.redirects ?? [])]) rename.set(n.from, n.to);
	for (const t of titles) {
		let name = 'File:' + t;
		for (let i = 0; i < 3 && rename.has(name); i++) name = rename.get(name);
		const page = pages.find((p) => p.title === name);
		const info = page && !page.missing && page.imageinfo?.[0];
		if (!info) continue;
		const meta = info.extmetadata ?? {};
		return {
			asked: t,
			title: page.title,
			url: info.url,
			page: info.descriptionurl,
			sha1: info.sha1,
			mime: info.mime,
			licence: stripHtml(meta.LicenseShortName?.value) || 'unknown',
			author: stripHtml(meta.Artist?.value) || 'unknown',
		};
	}
	return null;
}
async function search(q) {
	const data = await api({ action: 'query', list: 'search', srnamespace: '6', srlimit: '8', srsearch: `${q} filetype:drawing` });
	return (data.query?.search ?? []).map((r) => r.title).filter((t) => /\.svg$/i.test(t));
}

const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
const only = process.argv.slice(2);
const files = Object.keys(manifest).filter((k) => !k.startsWith('_') && (!only.length || only.includes(k)));
const unknown = only.filter((k) => !manifest[k]);
if (unknown.length) {
	console.error(`Not in ${MANIFEST}: ${unknown.join(', ')}`);
	process.exit(1);
}

let sources = {};
try {
	sources = JSON.parse((await readFile(SOURCES, 'utf8')).match(/<!-- data (.*) -->/s)?.[1] ?? '{}');
} catch {}

const missing = [];
for (const file of files) {
	const { titles, search: q } = manifest[file];
	const hit = await resolve(titles);
	if (!hit) {
		const found = await search(q);
		missing.push(file);
		console.log(`✗ ${file}: none of ${titles.map((t) => `"${t}"`).join(', ')} exists on Commons.`);
		console.log(found.length ? `    Search "${q}" found:\n${found.map((t) => `      ${t}`).join('\n')}` : `    Search "${q}" found nothing.`);
		continue;
	}
	if (hit.mime !== 'image/svg+xml') throw new Error(`${file}: ${hit.title} is ${hit.mime}, not an SVG`);
	const res = await fetch(hit.url, { headers: { 'User-Agent': UA } });
	if (!res.ok) throw new Error(`${file}: HTTP ${res.status} downloading ${hit.url}`);
	const bytes = Buffer.from(await res.arrayBuffer());
	const sha1 = createHash('sha1').update(bytes).digest('hex');
	if (sha1 !== hit.sha1) throw new Error(`${file}: SHA-1 ${sha1} doesn't match Commons' ${hit.sha1} for ${hit.title}`);
	await writeFile(join(FLAGS, file + '.svg'), bytes);
	sources[file] = { title: hit.title, page: hit.page, licence: hit.licence, author: hit.author, sha1 };
	console.log(`✓ ${file}.svg ← ${hit.title} (${hit.licence}, ${(bytes.length / 1024).toFixed(0)} KB)`);
	await sleep(300); // be gentle with Commons
}

const rows = Object.keys(sources)
	.sort()
	.map((f) => {
		const s = sources[f];
		return `| \`${f}.svg\` | [${s.title.replace(/^File:/, '')}](${s.page}) | ${s.licence} | ${s.author.replace(/\|/g, '/')} |`;
	});
await writeFile(
	SOURCES,
	`# Other versions of flags: where they come from

Downloaded unchanged from Wikimedia Commons by \`scripts/fetch-flag-versions.mjs\` (each checked against the SHA-1
Commons gives for it). Regenerated by that script; don't edit by hand.

| File | Commons file | Licence | Author |
| --- | --- | --- | --- |
${rows.join('\n')}

<!-- data ${JSON.stringify(sources)} -->
`,
);

console.log(`\n${files.length - missing.length} of ${files.length} downloaded; sources in ${SOURCES}`);
if (missing.length) {
	console.log(`Not found: ${missing.join(', ')}. Put the right Commons file name in "titles" for each and run again with just those.`);
	process.exit(1);
}
