// Every word States & Provinces shows, in English. Each other language is ../lang/<code>.json, written by
// tools-src/state-atlas/build/names.py from the translation in tools-src/state-atlas/i18n/<code>.json and listed in
// the page's SiteLanguage.start (/js/language.js picks the language and looks words up, as in every tool). The
// region names, and the kind of region ("states", "provinces"), are the map data's (data/); their other languages
// are in the same lang/<code>.json (units, kinds, types). Country, place and lake names are World Capitals' own,
// from its lang/<code>.json.
//
// {name} in a text is filled in; { one, other } is picked by the number n.

export const EN = {
	/* ---------- the page ---------- */
	map_aria: 'Map. Drag to turn it, scroll or pinch to zoom, click a country or a region.',
	home_aria: 'Home page',
	sub: 'Learn the regions of every country',
	title: 'States & Provinces',
	pick_country: 'Pick a country',
	loading: 'Loading…',
	answer_ph: 'Type its name',
	answer_aria: 'Name of the highlighted region',
	enter: 'Enter',
	skip: 'Skip',
	show_me: 'Show me',
	r_right: 'right',
	r_close: 'misspelled (½)',
	r_bad: 'missed',
	again: 'Again',
	practise_misses: 'Practise the misses',
	back_to_study: 'Back to Study',
	stat_score: 'Score',
	stat_time: 'Time',
	stat_streak: 'Streak',
	close: 'Close',
	find_country: 'Find a country',
	zoom_out: 'Zoom −',
	zoom_out_aria: 'Zoom out',
	zoom_in: 'Zoom +',
	zoom_in_aria: 'Zoom in',
	reset_view: 'Reset view',
	world: 'World',
	mode: 'Mode',
	mode_study: 'Study',
	mode_practice: 'Practice',
	mode_test: 'Test',
	questions: 'Questions',
	fmt_click: 'Click it',
	fmt_type: 'Type its name',
	restart: 'Restart',
	show_names: 'Show all names',
	keys: '<kbd>←</kbd><kbd>→</kbd> previous / next · <kbd>+</kbd><kbd>−</kbd> zoom · <kbd>Esc</kbd> deselect, then back to the globe · <kbd>N</kbd> names',
	names_credit: 'Names in other languages: Unicode CLDR and Natural Earth, from Wikidata (regions), and World Capitals’ own (countries, places and lakes).',
	credit: 'Beta. Borders match {wc}. Shapes: {ne} (public domain) and {gb} (open licences, incl. CC BY 4.0 and ODbL); Algeria © {osm} contributors (ODbL), by way of {ga}. Some countries are not yet up to date with recent reforms. Made by @samplesize_1.',
	countries: 'Countries',
	prev: '← Previous',
	next: 'Next →',
	options: 'Options',

	/* ---------- the country list ---------- */
	'continent.north-america': 'North America',
	'continent.south-america': 'South America',
	'continent.asia': 'Asia',
	'continent.europe': 'Europe',
	'continent.africa': 'Africa',
	'continent.oceania': 'Oceania',
	nothing_in: 'Nothing to learn in {names}: no subdivisions.',
	no_match: 'No country by that name.',

	/* ---------- settings ---------- */
	hint_study: 'Step through the regions with the arrows, or click any one to see its name. No score.',
	hint_practice: 'Every region is asked. Misses come back at the end of the round for another go.',
	hint_test: 'One go at each region, against the clock.',
	hint_click: 'You get a name; click it on the map. Tiny ones have a ring you can click.',
	hint_type: 'A region lights up; type its name. Accents don’t matter, and a small spelling slip counts as half a point.',
	format_in_study: 'Used in Practice and Test.',
	best_here: 'Best here: {score}/{total} in {time}',

	/* ---------- the prompt ---------- */
	overview: '{countries} countries · {regions} regions · {how}',
	overview_narrow: 'tap Countries, or a country on the globe',
	overview_wide: 'click one in the list or on the globe',
	eyebrow: '{mode} · {country}',
	score: '{score} / {total}',
	your_best: 'your best here',
	best_was: 'best {score}/{total} in {time}',
	click_region: 'click a region to see its name',
	which_lit: 'Which {kind} is lit up?',
	n_of: '{i} of {n}',
	how_click: 'click it on the map',
	how_type: 'type its name; Enter with nothing typed skips',
	n_kind: '{n} {kind}',
	far_off: { one: '{names} is off to the side: drag the map or zoom out', other: '{names} are off to the side: drag the map or zoom out' },
	tap_region: 'Tap a region to see its name',
	step_hint: '← → to step through them, or click any one',
	also: 'also {names}',

	/* ---------- what happened ---------- */
	loading_country: 'Loading {name}…',
	load_country_fail: 'Couldn’t load {name}. Check your connection and try again.',
	esc_again: 'Press Esc again to leave this round.',
	close_spelling: 'Close: it’s spelled {name}. Half a point.',
	its_name: 'It’s {name}.',
	is_here: '{name} is here.',
	marked_red: 'That’s {picked}. {name} is marked in red.',
	not_that_type: 'Not that. Try again, or press Show me.',
	not_that_click: 'That’s {picked}. Try again.',
	lake_is: 'That’s {name}.',
	a_lake: 'That’s a lake.',
	place_of: '{name} ({of})',
	not_country: '{name} isn’t a country in this quiz.',
	already_done: '{name} is already done.',
	last_one: 'That’s the last one left.',
};

/* ---------------- the language in use ---------------- */
// app.js opens it (/js/language.js) and hands it over here
let L = null;
export function useLanguage(lang) {
	L = lang;
}
export const t = (key, vars) => (L ? L.t(key, vars) : key);
export const language = () => L;

/* ---------------- names, in the language in use (English where it has none) ---------------- */
// layer 0 is this tool's lang/<code>.json, layer 1 World Capitals' (app.js opens both)
const file = (i) => (L && L.file(i)) || {};
// a region's name, and every name of it that counts as a typed answer in this language (English ones count too)
export const unitName = (u) => file(0).units?.[u.id]?.[0] || u.name;
export const unitForms = (u) => file(0).units?.[u.id] || [];
// a country's name, and its other names in this language, as on World Capitals
export const countryName = (c) => file(1).countries?.[c.id]?.[0] || c.name;
export const countryForms = (c) => file(1).countries?.[c.id] || [];
// land that is no country's (Greenland, and whose it is: Denmark), and lakes, by their English names
export const placeName = (en) => (en && file(1).places?.[en]) || en;
export const lakeName = (en) => (en && file(1).water?.[en]) || en;
// what sort of region one is ("City", "Autonomous Region"), shown beside its name
export const typeName = (type) => (type && file(0).types?.[type]) || type;
// the kind of region a country has: "51 states", "Which state is lit up?". English builds both from the map data's
// word; a language has its own pair for each kind, since its grammar can't be built from one word, and may have one
// for a country of its own ("states@DEU": Germany's Bundesländer, not Bundesstaaten)
const kindOf = (kind, country) => file(0).kinds?.[kind + '@' + country] || file(0).kinds?.[kind];
export function kindCount(kind, n, country) {
	const own = kindOf(kind, country)?.n;
	if (!own) return t('n_kind', { n, kind });
	let form = own;
	if (typeof own === 'object') {
		const rule = new Intl.PluralRules(L.tag).select(n);
		form = '=' + n in own ? own['=' + n] : own[rule] ?? own.other;
	}
	return String(form).replace('{n}', n.toLocaleString(L.tag));
}
export function kindWhich(kind, country) {
	const own = kindOf(kind, country)?.which;
	return own || t('which_lit', { kind: kind === 'subdivisions' ? 'region' : kind.replace(/ies$/, 'y').replace(/s$/, '') });
}
