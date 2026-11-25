// What the tool asks about each country. World Capitals, World Countries and World Flags are one tool
// (app.js: the map, the regions, Study / Practice / Test, click and type questions) with three subjects.
// Each page says which with <html data-subject="…">: no attribute means World Capitals. Everything
// that differs between them is here, and nothing here touches the page. The words are in text.js.
import { t, nameOf, capitalOf, nameForms as localNames, capitalForms as localCapitals, uiText } from './text.js';

/* ---------------- typed answers ---------------- */
// Letters only, accents off, lower case: "São Tomé" -> "saotome". Letters of any alphabet count (Москва,
// 東京, القاهرة), so a name typed in any language compares. (Accents and case: /js/language.js, as in every tool.)
export const norm = (s) =>
	SiteLanguage.fold(s)
		.replace(/\bst\b\.?/g, 'saint')
		.replace(/[^\p{L}\p{M}\p{N}]/gu, '');
export function editDistance(a, b) {
	const m = a.length, n = b.length;
	const d = Array.from({ length: m + 1 }, (_, i) => [i, ...new Array(n).fill(0)]);
	for (let j = 1; j <= n; j++) d[0][j] = j;
	for (let i = 1; i <= m; i++)
		for (let j = 1; j <= n; j++) {
			d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
			if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
		}
	return d[m][n];
}

/* ---------------- country names ---------------- */
// Other names that count as right when a country's name is typed: full official names and the short
// names people use. Not a part for the whole (England, Holland) and not an ambiguous one (Korea, Congo).
export const COUNTRY_ALTS = {
	USA: ['United States of America', 'USA', 'US', 'America'],
	GBR: ['UK', 'Great Britain', 'Britain'],
	ARE: ['UAE', 'Emirates'],
	COD: ['Democratic Republic of the Congo', 'DRC', 'Congo-Kinshasa'],
	COG: ['Congo-Brazzaville', 'Republic of Congo'],
	KOR: ['Republic of Korea'],
	PRK: ['DPRK'],
	CZE: ['Czech Republic'],
	TUR: ['Turkey'],
	CPV: ['Cape Verde'],
	TLS: ['East Timor'],
	CIV: ['Ivory Coast'],
	MMR: ['Burma'],
	VAT: ['Vatican', 'Holy See'],
	FSM: ['Federated States of Micronesia'],
	PSX: ['State of Palestine'],
	CAF: ['CAR'],
	BIH: ['Bosnia-Herzegovina', 'Bosnia'],
	RUS: ['Russian Federation'],
	CHN: ["People's Republic of China"],
	TWN: ['Republic of China'],
	VNM: ['Viet Nam'],
	LAO: ['Lao'],
	SYR: ['Syrian Arab Republic'],
	BRN: ['Brunei Darussalam'],
	MKD: ['Macedonia'],
	KNA: ['Saint Christopher and Nevis'],
	PNG: ['PNG'],
	NZL: ['NZ'],
};
// Old names: typing one gets "that's its old name" instead of a plain wrong answer
export const COUNTRY_FORMER = {
	SWZ: ['Swaziland'],
	LKA: ['Ceylon'],
	BFA: ['Upper Volta'],
	BEN: ['Dahomey'],
	KHM: ['Kampuchea'],
	THA: ['Siam'],
	ZWE: ['Rhodesia'],
	COD: ['Zaire'],
	IRN: ['Persia'],
};
// Every spelling of a country's name that counts: with and without "the" in front ("The Gambia"),
// and with "and" left out ("Antigua & Barbuda" types as "Antigua Barbuda")
export function nameForms(c) {
	const out = [];
	for (const s of [c.name, ...(COUNTRY_ALTS[c.id] || [])]) {
		out.push(s, 'The ' + s);
		if (/\band\b/.test(s)) out.push(s.replace(/\band\b/g, ' '));
	}
	return out;
}

/* ---------------- flags ---------------- */
// Shown with a flag once it has been answered or looked at (never before: it would give it away)
export const FLAG_NOTES = {
	AFG: 'The main flag here is the Islamic Republic’s, still used by the UN, the Olympics and many embassies.',
	SYR: 'Adopted in 2025, after the fall of the Assad government. Until then Syria’s flag was red, white and black with two green stars.',
	KGZ: 'Redrawn in 2023 with straight rays; the old flag’s rays were wavy.',
	TCD: 'Almost the same as Romania’s: Chad’s blue is a little darker.',
	ROU: 'Almost the same as Chad’s: Romania’s blue is a little lighter.',
	IDN: 'The same red over white as Monaco’s, but longer (2:3; Monaco’s is 4:5).',
	MCO: 'The same red over white as Indonesia’s, but squarer (4:5; Indonesia’s is 2:3).',
	NLD: 'Like Luxembourg’s, with a darker blue and a shorter shape.',
	LUX: 'Like the Netherlands’, with a lighter blue and a longer shape.',
	IRL: 'Green on the left (by the pole). Côte d’Ivoire’s is the same colours the other way round.',
	CIV: 'Orange on the left (by the pole). Ireland’s is the same colours the other way round.',
	AUS: 'Six white stars. New Zealand’s has four red ones and no small star.',
	NZL: 'Four red stars outlined in white. Australia’s has six white ones.',
	SEN: 'Like Mali’s, with a green star in the middle.',
	MLI: 'Green, yellow and red from the pole. Senegal’s adds a green star; Guinea’s has the same colours the other way round.',
	GIN: 'Red, yellow and green from the pole. Mali’s has the same colours the other way round.',
	COL: 'The yellow takes the top half. Ecuador’s is the same, with its coat of arms in the middle.',
	ECU: 'Like Colombia’s, with Ecuador’s coat of arms in the middle.',
	VEN: 'Yellow, blue and red in equal stripes, with an arc of eight stars.',
	SVN: 'White, blue and red, with Slovenia’s coat of arms (Mount Triglav) near the top left.',
	SVK: 'White, blue and red, with Slovakia’s coat of arms (a double cross on three hills) toward the pole.',
	RUS: 'White, blue and red, with no coat of arms.',
	NOR: 'A blue cross outlined in white on red. Iceland’s is the same with the colours swapped.',
	ISL: 'A red cross outlined in white on blue. Norway’s is the same with the colours swapped.',
	QAT: 'Maroon, and long (11:28). Bahrain’s is red and has five points.',
	BHR: 'Red, with five white points. Qatar’s is maroon, longer and has nine.',
	NPL: 'The only national flag that isn’t a rectangle.',
	CHE: 'Square, like the Vatican’s.',
	VAT: 'Square, like Switzerland’s.',
};
// Flags with more than one official version: a state flag and a civil flag, optional or alternative versions,
// a co-official flag, or a different back. The main picture is flags/<id>.svg; each other version is
// flags/<file>.svg, downloaded from Wikimedia Commons by scripts/fetch-flag-versions.mjs (sources in
// flag-atlas/flags/VERSION-SOURCES.md). They show beside the main flag in Study and once answered, and are
// asked about too when "Either version" is on (setFlagVersions). main: what the main picture is.
export const FLAG_VERSIONS = {
	AFG: { main: 'Flag of the Islamic Republic', others: [['AFG-emirate', 'Flag of the Taliban government (since 2021)']] },
	AND: { main: 'State and civil flag', others: [['AND-civil', 'Optional civil flag']] },
	ARG: { main: 'State and civil flag', others: [['ARG-civil', 'Optional civil flag']] },
	AUT: { main: 'Civil flag', others: [['AUT-state', 'State flag']] },
	BOL: { main: 'State flag', others: [['BOL-civil', 'Civil flag'], ['BOL-wiphala', 'Wiphala, a second national flag']] },
	CRI: { main: 'State flag', others: [['CRI-civil', 'Civil flag']] },
	DEU: { main: 'Civil flag', others: [['DEU-state', 'State flag']] },
	DNK: { main: 'Civil flag', others: [['DNK-state', 'State flag']] },
	DOM: { main: 'State flag', others: [['DOM-civil', 'Civil flag']] },
	ESP: { main: 'State and civil flag', others: [['ESP-civil', 'Optional civil flag']] },
	FIN: { main: 'Civil flag', others: [['FIN-state', 'State flag']] },
	GTM: { main: 'State flag', others: [['GTM-civil', 'Civil flag']] },
	HTI: { main: 'State flag', others: [['HTI-civil', 'Civil flag']] },
	HUN: { main: 'State and civil flag', others: [['HUN-state', 'Optional state flag']] },
	ISL: { main: 'Civil flag', others: [['ISL-state', 'State flag']] },
	ITA: { main: 'Civil flag', others: [['ITA-state', 'State flag (at sea only)']] },
	LIE: { main: 'Civil flag', others: [['LIE-state', 'State flag']] },
	MCO: { main: 'Civil flag', others: [['MCO-state', 'State flag']] },
	NGA: { main: 'Civil flag', others: [['NGA-state', 'State flag']] },
	NIC: { main: 'State and civil flag', others: [['NIC-alt', 'Alternative state flag']] },
	NOR: { main: 'Civil flag', others: [['NOR-state', 'State flag']] },
	PER: { main: 'State flag', others: [['PER-civil', 'Civil flag']] },
	POL: { main: 'Civil flag', others: [['POL-state', 'State flag']] },
	PRY: { main: 'Front', others: [['PRY-reverse', 'Back']] },
	SLV: { main: 'State flag', others: [['SLV-civil', 'Civil flag'], ['SLV-alt', 'Alternative state flag']] },
	SMR: { main: 'State flag', others: [['SMR-civil', 'Civil flag']] },
	SRB: { main: 'State flag', others: [['SRB-civil', 'Civil flag']] },
	TUV: { main: 'State and civil flag', others: [['TUV-alt', 'Alternative state flag']] },
	URY: { main: 'State and civil flag', others: [['URY-artigas', 'Artigas flag (alternative state flag)'], ['URY-33', 'Flag of the Treinta y Tres (alternative state flag)']] },
	VEN: { main: 'Civil flag', others: [['VEN-state', 'State flag']] },
};
// What the versions are, in a sentence: shown with the flag note. A country added without one gets a sentence
// built from the labels above (versionsLine)
const VERSION_NOTES = {
	AFG: 'Since 2021 the Taliban government has used a white flag with the shahada in black.',
	AND: 'The optional civil flag leaves out the coat of arms; then it’s very like Chad’s and Romania’s.',
	ARG: 'The optional civil flag leaves out the Sun of May.',
	AUT: 'The state flag adds Austria’s coat of arms (a black eagle) in the middle.',
	BOL: 'The coat of arms is on the state flag; the civil flag is plain. The Wiphala, chequered in seven colours, is a second national flag.',
	CRI: 'The civil flag has no coat of arms; then it’s Thailand’s with the red and blue swapped.',
	DEU: 'The federal government’s flag adds the eagle on a shield, a little toward the pole.',
	DNK: 'The state flag is swallow-tailed.',
	DOM: 'The civil flag has no coat of arms in the middle of the white cross.',
	ESP: 'The optional civil flag leaves out the coat of arms.',
	FIN: 'The state flag adds the coat of arms where the arms of the cross meet.',
	GTM: 'The civil flag has no coat of arms: just sky blue, white and sky blue.',
	HTI: 'The civil flag has no white panel or coat of arms: just blue over red.',
	HUN: 'The optional state flag adds the coat of arms in the middle.',
	ISL: 'The state flag is swallow-tailed.',
	ITA: 'At sea, the state flag adds a crowned shield with the arms of Venice, Genoa, Amalfi and Pisa.',
	LIE: 'The state flag adds the prince’s coat of arms in the middle.',
	MCO: 'The state flag is white, with the prince’s coat of arms.',
	NGA: 'The state flag adds the coat of arms on the white stripe.',
	NIC: 'The alternative state flag is a plain red and black flag.',
	NOR: 'The state flag is swallow-tailed, with a tongue in the middle.',
	PER: 'The coat of arms is on the state flag; the civil flag is plain red, white and red.',
	POL: 'The state flag adds the coat of arms, a white eagle, on the white stripe.',
	PRY: 'The only national flag with different sides: the national seal on the front, the treasury seal (a lion) on the back.',
	SLV: 'The civil flag has no coat of arms; the alternative state flag has the motto “Dios Unión Libertad” in gold instead.',
	SMR: 'The civil flag has no coat of arms: just white over light blue.',
	SRB: 'The civil flag has no coat of arms; then it’s Russia’s colours upside down.',
	TUV: 'The alternative state flag adds Tuvalu’s coat of arms, a shield, in the fly.',
	URY: 'Two historical flags are also official state flags: Artigas’s, with a red diagonal band, and the Treinta y Tres’s, “Libertad o Muerte”.',
	VEN: 'The state flag adds the coat of arms in the top corner by the pole.',
};
const otherVersions = (id) => FLAG_VERSIONS[id]?.others ?? [];
const versionLabel = (file) => {
	for (const [id, v] of Object.entries(FLAG_VERSIONS)) {
		if (file === id) return v.main;
		const o = v.others.find(([f]) => f === file);
		if (o) return o[1];
	}
	return '';
};
const versionsLine = (id) => {
	const v = FLAG_VERSIONS[id];
	if (!v) return '';
	return uiText('flag_versions.' + id) ?? VERSION_NOTES[id] ?? `Other versions: ${v.others.map(([, l]) => l).join('; ')}.`;
};
let eitherVersion = false; // "Either version": questions show any version of a flag, at random
const picked = new Map(); // which version each question showed, kept for the session
export function setFlagVersions(either) {
	eitherVersion = !!either;
	picked.clear();
}
export const resetFlagPicks = () => picked.clear();
function askedFlag(c) {
	const others = otherVersions(c.id);
	if (!eitherVersion || !others.length) return c.id;
	if (!picked.has(c.id)) {
		const all = [c.id, ...others.map(([f]) => f)];
		picked.set(c.id, all[Math.floor(Math.random() * all.length)]);
	}
	return picked.get(c.id);
}
// the version that was asked about, and the rest to show beside it once answered
const revealFlags = (c) => {
	const a = askedFlag(c);
	return { flag: a, flag2: [c.id, ...otherVersions(c.id).map(([f]) => f)].filter((f) => f !== a) };
};
export const flagLabel = versionLabel;
// The picture of a country's flag (World Flags only): flag-atlas/flags/<id>.svg, from the folder of this file
export const flagUrl = (id) => new URL(`../flag-atlas/flags/${id}.svg`, import.meta.url).href;

/* ---------------- the three subjects ---------------- */
// A capital's note (countries.json) and a flag's note, in the language in use where they've been translated
const note = (c) => uiText('note.' + c.id) ?? c.note ?? '';
const flagNote = (c) => join(uiText('flag.' + c.id) ?? FLAG_NOTES[c.id] ?? '', versionsLine(c.id));
const join = (...parts) => parts.filter(Boolean).join(' ');
// World Capitals' third question type, "Type the country": the capital is given and the country typed. The
// parts of a question that change with it ask rev() (setCapitalsReverse switches it)
let reverse = false;
export function setCapitalsReverse(on) {
	reverse = !!on;
}
const rev = (forward, backward) => (...a) => (reverse ? backward : forward)(...a);
const capitals = {
	key: 'capitals',
	tool: 'capital-atlas', // the folder, and the id its progress is saved under
	name: 'World Capitals',
	answer: rev((c) => capitalOf(c), (c) => nameOf(c)), // what a typed answer has to be (as shown)
	// what counts: the capital in the language in use, and in English with its other names (or, typing the
	// country, its names)
	forms: rev((c) => [...localCapitals(c), c.capital, ...(c.alts || [])], (c) => [...localNames(c), ...nameForms(c)]),
	former: rev((c) => c.formerly || [], (c) => COUNTRY_FORMER[c.id] || []),
	formerMsg: rev((typed) => t('capitals.former', { typed }), (typed) => t('countries.former', { typed })),
	otherMsg: (o) => t('capitals.other', { capital: capitalOf(o), name: nameOf(o) }),
	tell: rev((c) => t('capitals.tell', { name: nameOf(c), capital: capitalOf(c) }), (c) => t('capitals.capital_of', { capital: capitalOf(c), name: nameOf(c) })),
	fact: (c) => t('capitals.fact', { name: nameOf(c), capital: capitalOf(c) }), // a country named, with what it teaches
	outside: (c, region) => t('capitals.outside', { name: nameOf(c), capital: capitalOf(c), region }),
	missClick: (c) => t('capitals.miss_click', { name: nameOf(c) }), // a wrong click: c was asked for
	callout: (c) => ({ title: capitalOf(c), sub: nameOf(c) }),
	label: (c) => capitalOf(c), // on the spinning globe
	dots: true, // a dot on every capital
	waterNames: true, // the names of oceans, seas, lakes and rivers show until a visitor turns them off (L)
	around: [7, 4.5], // the least a view of one country shows: degrees of longitude and latitude each side of its middle
	// typed questions light up the country being asked about (not when the country is the answer)
	get lightTyped() {
		return !reverse;
	},
	// a country's name answers a question (so voice can't fly to one mid-quiz)
	get namesAnswer() {
		return reverse;
	},
	placeholder: rev(() => t('capitals.placeholder'), () => t('countries.placeholder')),
	study: (c) => ({ name: t('capitals.pair', { name: nameOf(c), capital: capitalOf(c) }), tip: note(c) }),
	clickAsk: (c) => ({ eyebrow: t('capitals.click_ask'), name: capitalOf(c) }),
	clickReveal: (c) => ({ eyebrow: t('here_it_is'), name: capitalOf(c), tip: join(t('capitals.capital_of', { capital: capitalOf(c), name: nameOf(c) }), note(c)) }),
	typeAsk: rev((c) => ({ eyebrow: t('capitals.type_ask'), name: nameOf(c) }), (c) => ({ eyebrow: t('capitals.rev_type_ask'), name: capitalOf(c) })),
	typeReveal: rev(
		(c) => ({ eyebrow: t('capitals.type_reveal', { name: nameOf(c) }), name: capitalOf(c), tip: join(t('type_it'), note(c)) }),
		(c) => ({ eyebrow: t('capitals.rev_type_reveal', { capital: capitalOf(c) }), name: nameOf(c), tip: join(t('type_it'), note(c)) }),
	),
	hint: (k) => t('capitals.' + (reverse && k.startsWith('type') ? 'rev_' : '') + k + '_hint'), // study, click, type, type_hard
	reversible: true, // has "Type the country" (setCapitalsReverse)
};
const countries = {
	key: 'countries',
	tool: 'country-atlas',
	name: 'World Countries',
	answer: (c) => nameOf(c),
	forms: (c) => [...localNames(c), ...nameForms(c)],
	former: (c) => COUNTRY_FORMER[c.id] || [],
	formerMsg: (typed) => t('countries.former', { typed }),
	otherMsg: (o) => t('countries.other', { name: nameOf(o) }),
	tell: (c) => t('countries.tell', { name: nameOf(c) }),
	fact: (c) => t('countries.fact', { name: nameOf(c) }),
	outside: (c, region) => t('countries.outside', { name: nameOf(c), region }),
	missClick: (c, clicked) => t('countries.miss_click', { name: nameOf(c), clicked: nameOf(clicked) }),
	callout: (c) => ({ title: nameOf(c), sub: '' }),
	label: (c) => nameOf(c),
	dots: false,
	waterNames: false, // off at first: the map is for finding countries; L or the Names button turns them on
	around: [16, 10],
	lightTyped: true,
	namesAnswer: true,
	placeholder: () => t('countries.placeholder'),
	study: (c) => ({ name: nameOf(c), tip: '' }),
	clickAsk: (c) => ({ eyebrow: t('countries.click_ask'), name: nameOf(c) }),
	clickReveal: (c) => ({ eyebrow: t('here_it_is'), name: nameOf(c), tip: '' }),
	typeAsk: () => ({ eyebrow: t('countries.type_ask'), name: t('countries.the_glowing') }),
	typeReveal: (c) => ({ eyebrow: t('countries.type_reveal'), name: nameOf(c), tip: t('type_it') }),
	hint: (k) => t('countries.' + k + '_hint'),
};
const flags = {
	...countries,
	key: 'flags',
	tool: 'flag-atlas',
	name: 'World Flags',
	formerMsg: (typed) => t('flags.former', { typed }),
	otherMsg: (o) => t('flags.other', { name: nameOf(o) }),
	tell: (c) => t('flags.tell', { name: nameOf(c) }),
	fact: (c) => t('flags.fact', { name: nameOf(c) }),
	outside: (c, region) => t('flags.outside', { name: nameOf(c), region }),
	missClick: (c, clicked) => t('flags.miss_click', { name: nameOf(c), clicked: nameOf(clicked) }),
	callout: (c) => ({ title: nameOf(c), sub: '', flag: askedFlag(c) }),
	lightTyped: false, // the flag is the question: lighting the country would give the answer away
	placeholder: () => t('flags.placeholder'),
	study: (c) => ({ name: nameOf(c), flag: c.id, flag2: otherVersions(c.id).map(([f]) => f), tip: flagNote(c) }),
	clickAsk: (c) => ({ eyebrow: t('flags.click_ask'), name: '', flag: askedFlag(c) }),
	clickReveal: (c) => ({ eyebrow: t('here_it_is'), name: nameOf(c), ...revealFlags(c), tip: flagNote(c) }),
	typeAsk: (c) => ({ eyebrow: t('flags.type_ask'), name: '', flag: askedFlag(c) }),
	typeReveal: (c) => ({ eyebrow: t('flags.type_reveal'), name: nameOf(c), ...revealFlags(c), tip: join(t('type_it'), flagNote(c)) }),
	versions: true, // has flags with more than one version (FLAG_VERSIONS), and the "Either version" setting
	hint: (k) => t('flags.' + k + '_hint'),
};
export const SUBJECTS = { capitals, countries, flags };
export const subjectFor = (key) => SUBJECTS[key] || capitals;

/* ---------------- checking a typed answer ---------------- */
// -> checkAnswer(c, typed, { strict, keepSecret }): { ok, note } or { ok: false, msg }; a near miss in
// Easy is { ok: true, close: true, note } (half a point).
// strict: spelling must be exact (accents, capitals and punctuation still don't matter).
// keepSecret: a wrong answer's message doesn't give the answer away.
// The checker knows the names in the language in use when it is made: make a new one after a language change.
export function makeChecker(S, list) {
	const index = new Map(); // a normalised answer -> the country it belongs to
	for (const c of list) for (const s of S.forms(c)) if (norm(s) && !index.has(norm(s))) index.set(norm(s), c);
	return function checkAnswer(c, typed, { strict = false, keepSecret = false } = {}) {
		const n = norm(typed);
		const forms = S.forms(c).map(norm).filter(Boolean);
		if (n && forms.includes(n)) return { ok: true };
		const tell = ' ' + (keepSecret ? t('try_again') : S.tell(c));
		if (S.former(c).map(norm).includes(n)) return { ok: false, msg: S.formerMsg(typed.trim()) + tell };
		const other = index.get(n);
		if (other && other !== c) return { ok: false, msg: S.otherMsg(other) + tell };
		const slack = strict ? 0 : n.length >= 8 ? 2 : n.length >= 5 ? 1 : 0;
		if (slack && forms.some((f) => editDistance(n, f) <= slack)) return { ok: true, close: true, note: t('close_note', { answer: S.answer(c) }) };
		if (keepSecret) return { ok: false, msg: t('not_quite') };
		const near = strict && forms.some((f) => editDistance(n, f) <= (n.length >= 8 ? 2 : 1));
		return { ok: false, msg: near ? t('so_close_hard', { answer: S.answer(c) }) : S.fact(c) };
	};
}
