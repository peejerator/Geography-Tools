#!/usr/bin/env node
// Builds currency-atlas/data/currencies.json: the currencies each of the 197 countries uses, for World
// Currencies. Sources:
//  - which currencies: ISO 4217 List One, from SIX, the ISO 4217 maintenance agency
//    (https://www.six-group.com/en/products-services/financial-information/data-standards.html). Fund codes
//    (Bolivia's Mvdol, Chile's Unidad de Fomento...) are left out: they aren't money people use.
//  - English names and symbols: the Unicode CLDR, through Node's Intl (the same data browsers use, which is
//    also how the page names currencies in its other languages).
//
//   node scripts/build-currencies.mjs                 downloads the current list from SIX
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
// a country's own currency first (Bhutan: the ngultrum, then the Indian rupee): fewest users first
const users = (code) => Object.values(out).filter((v) => v.includes(code)).length;
for (const id in out) out[id].sort((a, b) => users(a) - users(b));

const missing = list.filter((c) => !out[c.id]).map((c) => `${c.id} ${c.name}`);
if (missing.length) {
	console.error(`No currency for: ${missing.join(', ')}. Add their ISO names to ISO_NAMES.`);
	process.exit(1);
}

const codes = [...new Set(Object.values(out).flat())].sort();
const currencies = Object.fromEntries(
	codes.map((code) => [code, { name: en.of(code), iso: isoNames[code] ?? en.of(code), symbol: symbolOf(code) }]),
);
const data = {
	about: `Currencies by country: ISO 4217 List One published ${published} (SIX, for ISO), funds left out; English names and symbols from the Unicode CLDR (Node ${process.versions.node}, CLDR ${process.versions.cldr}). Built by scripts/build-currencies.mjs.`,
	published,
	countries: Object.fromEntries(list.map((c) => [c.id, out[c.id]])),
	currencies,
};
await writeFile(OUT, JSON.stringify(data, null, '\t') + '\n');
const shared = codes.filter((code) => Object.values(out).filter((v) => v.includes(code)).length > 1);
console.log(`${list.length} countries, ${codes.length} currencies (ISO list of ${published}) → ${OUT}`);
console.log(`Used by more than one country: ${shared.join(', ')}`);
console.log(`More than one currency: ${Object.entries(out).filter(([, v]) => v.length > 1).map(([id, v]) => `${id} ${v.join('+')}`).join(', ')}`);
