#!/usr/bin/env node
// Builds currency-atlas/data/currencies.json for World Currencies: each of the 197 countries' main currency
// (the one asked about) and any others also legal tender there. Sources, both downloaded when it runs:
//  - ISO 4217 List One, from SIX, the ISO 4217 maintenance agency
//    (https://www.six-group.com/en/products-services/financial-information/data-standards.html). Fund codes
//    and units of account (Bolivia's Mvdol, Chile's Unidad de Fomento...) are left out: nobody pays with them.
//  - The Unicode CLDR's currency data (cldr-json on GitHub): which of those are current tender in each
//    country, and which comes first. Its English names and symbols come through Node's Intl (the same data
//    browsers use, which is also how the page names currencies in its other languages).
// A country's main currency is CLDR's first of those both list as current, except where MAIN says otherwise
// (each with its reason); any others current in both, or that CLDR lists as current tender, are also legal
// tender there. Where the two sources disagree it says so, for checking.
//
//   node scripts/build-currencies.mjs                 downloads the current ISO list from SIX
//   node scripts/build-currencies.mjs list-one.xml    uses a copy of it
//
// The ISO list names "entities" its own way ("BOLIVIA (PLURINATIONAL STATE OF)"), so each is matched to a
// country by name, with the exceptions in ISO_NAMES. It stops if a country gets no currency.
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'currency-atlas', 'data', 'currencies.json');
const SIX = 'https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml';
const CLDR = 'https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-core/supplemental/currencyData.json';
// The main currency, where it isn't CLDR's first: what people mainly pay with (checked November 2026)
const MAIN = {
	PAN: ['USD', 'the balboa is only coins; US banknotes are the main cash (Wikipedia, Panamanian balboa)'],
	LSO: ['LSL', 'Lesotho’s own currency, at par with the rand and used alongside it'],
};

// ISO entity names that don't match the country's name in countries.json (or its other names)
const ISO_NAMES = {
	'BOLIVIA (PLURINATIONAL STATE OF)': 'BOL',
	'BRUNEI DARUSSALAM': 'BRN',
	'CABO VERDE': 'CPV',
	'CONGO (THE DEMOCRATIC REPUBLIC OF THE)': 'COD',
	'CONGO (THE)': 'COG',
	"CÔTE D'IVOIRE": 'CIV',
	'CZECHIA': 'CZE',
	'DOMINICAN REPUBLIC (THE)': 'DOM',
	'ESWATINI': 'SWZ',
	'GAMBIA (THE)': 'GMB',
	'HOLY SEE (THE)': 'VAT',
	'IRAN (ISLAMIC REPUBLIC OF)': 'IRN',
	"KOREA (THE DEMOCRATIC PEOPLE'S REPUBLIC OF)": 'PRK',
	'KOREA (THE REPUBLIC OF)': 'KOR',
	"LAO PEOPLE'S DEMOCRATIC REPUBLIC (THE)": 'LAO',
	'MICRONESIA (FEDERATED STATES OF)': 'FSM',
	'MOLDOVA (THE REPUBLIC OF)': 'MDA',
	'NETHERLANDS (THE)': 'NLD',
	'NIGER (THE)': 'NER',
	'PHILIPPINES (THE)': 'PHL',
	'RUSSIAN FEDERATION (THE)': 'RUS',
	'SUDAN (THE)': 'SDN',
	'SYRIAN ARAB REPUBLIC': 'SYR',
	'TAIWAN (PROVINCE OF CHINA)': 'TWN',
	'TANZANIA, UNITED REPUBLIC OF': 'TZA',
	'TÜRKİYE': 'TUR',
	'UNITED ARAB EMIRATES (THE)': 'ARE',
	'UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND (THE)': 'GBR',
	'UNITED STATES OF AMERICA (THE)': 'USA',
	'VENEZUELA (BOLIVARIAN REPUBLIC OF)': 'VEN',
	'VIET NAM': 'VNM',
	'COMOROS (THE)': 'COM',
	'CENTRAL AFRICAN REPUBLIC (THE)': 'CAF',
	'MARSHALL ISLANDS (THE)': 'MHL',
	'SOLOMON ISLANDS': 'SLB',
	'MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF)': 'MKD',
	'NORTH MACEDONIA': 'MKD',
	'TIMOR-LESTE': 'TLS',
	'MYANMAR': 'MMR',
	'PALESTINE, STATE OF': null, // "No universal currency": see NOT_IN_ISO
};
// A currency's own word, without its country's (asked as "Kina", not "Papua New Guinean Kina"): the last word of
// its English name, except these
const SHORT = { BAM: 'Convertible Mark' };
// The country whose own currency a shared one is (Nauru uses Australia's dollar); the euro, the CFA francs and the
// East Caribbean dollar belong to no one country
const ISSUER = { AUD: 'AUS', USD: 'USA', CHF: 'CHE', ILS: 'ISR' };
// units of account the list doesn't mark as funds, but nobody pays with
const NOT_MONEY = new Set(['UYW']); // Uruguay's Unidad Previsional, an index for pensions
// countries ISO 4217 has no entry for, with the currency they use
const NOT_IN_ISO = {
	KOS: ['EUR'], // Kosovo: not in the list; it uses the euro
	PSX: ['ILS', 'JOD'], // Palestine: "no universal currency"; the shekel and the Jordanian dinar are used
};

const xml = process.argv[2]
	? await readFile(process.argv[2], 'utf8')
	: await fetch(SIX).then((r) => {
			if (!r.ok) throw new Error(`HTTP ${r.status} from ${SIX}`);
			return r.text();
		});
const published = xml.match(/Pblshd="([^"]+)"/)?.[1] ?? 'unknown';
const entries = [...xml.matchAll(/<CcyNtry>([\s\S]*?)<\/CcyNtry>/g)].map(([, e]) => ({
	entity: e.match(/<CtryNm>([^<]*)</)?.[1]?.trim().replace(/&apos;|’/g, "'").replace(/&amp;/g, '&'),
	code: e.match(/<Ccy>([^<]*)</)?.[1],
	isoName: e.match(/<CcyNm[^>]*>([^<]*)</)?.[1]?.trim(),
	fund: /<CcyNm IsFund="true"/.test(e),
}));

const cldr = (await fetch(CLDR).then((r) => {
	if (!r.ok) throw new Error(`HTTP ${r.status} from ${CLDR}`);
	return r.json();
})).supplemental.currencyData.region;
const cldrVersion = (await fetch(CLDR.replace('supplemental/currencyData.json', 'package.json')).then((r) => (r.ok ? r.json() : {})).catch(() => ({}))).version ?? 'main';
// CLDR's current tender currencies for a two-letter region code, in its order
const cldrNow = (cc) =>
	(cldr[cc] ?? []).map((o) => Object.entries(o)[0]).filter(([, v]) => !v._to && v._tender !== 'false').map(([k]) => k);

const countries = JSON.parse(await readFile(join(ROOT, 'capital-atlas', 'data', 'countries.json'), 'utf8'));
const list = Array.isArray(countries) ? countries : countries.countries;
const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
const byName = new Map();
for (const c of list) for (const n of [c.name, ...(c.alts || [])]) byName.set(fold(n), c.id);
const idOf = (entity) =>
	entity in ISO_NAMES ? ISO_NAMES[entity] : (byName.get(fold(entity)) ?? byName.get(fold(entity.replace(/\s*\(THE\)$/, ''))));

const en = new Intl.DisplayNames(['en'], { type: 'currency' });
const symbolOf = (code) => {
	try {
		const parts = new Intl.NumberFormat('en', { style: 'currency', currency: code, currencyDisplay: 'narrowSymbol' }).formatToParts(1);
		const s = parts.find((p) => p.type === 'currency')?.value;
		return s && s !== code ? s : null;
	} catch {
		return null;
	}
};

const out = {};
const isoNames = {};
for (const e of entries) {
	if (!e.code || e.fund || NOT_MONEY.has(e.code) || !e.entity) continue;
	const id = idOf(e.entity);
	if (!id || !list.some((c) => c.id === id)) continue;
	(out[id] ||= []).includes(e.code) || out[id].push(e.code);
	isoNames[e.code] = e.isoName;
}
for (const [id, codes] of Object.entries(NOT_IN_ISO)) if (list.some((c) => c.id === id) && !out[id]) out[id] = codes;
// CLDR names countries by two letters: from its own table of three-letter codes, or these
const mappings = await fetch(CLDR.replace('currencyData.json', 'codeMappings.json')).then((r) => {
	if (!r.ok) throw new Error(`HTTP ${r.status} for CLDR codeMappings.json`);
	return r.json();
});
const alpha2 = new Map(Object.entries(mappings.supplemental.codeMappings).filter(([, v]) => v._alpha3).map(([k, v]) => [v._alpha3, k]));
const CC = { KOS: 'XK', PSX: 'PS', SDS: 'SS' };
const report = [];
const result = {};
for (const c of list) {
	const iso = out[c.id] ?? [];
	const cc = CC[c.id] ?? alpha2.get(c.id);
	if (!cc) report.push(`${c.id} ${c.name}: no two-letter code, ISO only`);
	const now = cc ? cldrNow(cc) : [];
	// current in both (or, where one has nothing for the country, the other)
	let codes = now.length ? now.filter((x) => !iso.length || iso.includes(x) || NOT_IN_ISO[c.id]?.includes(x)) : iso;
	if (!codes.length) codes = now.length ? now : iso; // no overlap: CLDR, which dates each change (Bulgaria's euro)
	const onlyIso = iso.filter((x) => !now.includes(x)), onlyCldr = now.filter((x) => !iso.includes(x));
	if (now.length && (onlyIso.length || onlyCldr.length))
		report.push(`${c.id} ${c.name}: ISO ${iso.join('+') || '-'}, CLDR ${now.join('+') || '-'} → ${codes.join('+')}`);
	const [forced, why] = MAIN[c.id] ?? [];
	const main = forced ?? codes[0];
	if (forced) report.push(`${c.id} ${c.name}: main ${forced} (${why})`);
	// also legal tender: the rest of those, and any CLDR lists as current tender that ISO doesn't (Zimbabwe's
	// US dollar); not ones only ISO still lists (El Salvador's colón, out of use since 2001)
	result[c.id] = { main, also: [...new Set([...codes, ...onlyCldr, ...(forced ? iso : [])])].filter((x) => x !== main) };
}

const missing = list.filter((c) => !out[c.id]).map((c) => `${c.id} ${c.name}`);
if (missing.length) {
	console.error(`No currency for: ${missing.join(', ')}. Add their ISO names to ISO_NAMES.`);
	process.exit(1);
}

const codes = [...new Set(Object.values(result).flatMap((r) => [r.main, ...r.also]))].sort();
const users = (code) => list.filter((c) => result[c.id].main === code).map((c) => c.id);
const currencies = Object.fromEntries(
	codes.map((code) => {
		const name = en.of(code), u = users(code);
		// issuer: the country it's that country's own currency of (one user, or ISSUER); null for shared ones
		const issuer = u.length === 1 ? u[0] : (ISSUER[code] ?? null);
		return [code, { name, iso: isoNames[code] ?? name, symbol: symbolOf(code), short: SHORT[code] ?? name.split(/\s+/).pop(), issuer }];
	}),
);
const data = {
	about: `Each country's main currency and any others also legal tender: ISO 4217 List One published ${published} (SIX, for ISO; funds left out) and CLDR currency data (${cldrVersion}); English names and symbols from the Unicode CLDR (Node ${process.versions.node}, CLDR ${process.versions.cldr}). Built by scripts/build-currencies.mjs.`,
	published,
	countries: result,
	currencies,
};
await writeFile(OUT, JSON.stringify(data, null, '\t') + '\n');
console.log(`${list.length} countries, ${codes.length} currencies (ISO list of ${published}, CLDR ${cldrVersion}) → ${OUT}`);
console.log(`\nWhere ISO and CLDR differ, and main currencies set by hand:\n  ${report.join('\n  ')}`);
console.log(`\nMore than one currency: ${Object.entries(result).filter(([, v]) => v.also.length).map(([id, v]) => `${id} ${v.main}+${v.also.join('+')}`).join(', ')}`);
