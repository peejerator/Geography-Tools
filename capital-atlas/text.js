// Every word World Capitals, World Countries and World Flags show, and the names in the language in use.
//
// EN below is the English text. A key with a subject in front ('capitals.sub') is that tool's own wording and
// wins over the plain key. Other languages come from lang/<code>.json (built by tools-src/capital-atlas/lang.mjs):
// country, capital, place and water names for all of them, and the interface (ui) for the ones it has been
// translated into. Picking, loading and looking up a language is /js/language.js, the same for every tool; the
// start-up text (the loading line) is in the page. No page code here.
//
// {name} in a text is filled in; a text can also be { one: '…', other: '…' } (or few / many), picked by the number n.

export const EN = {
	/* ---------- the page ---------- */
	map_aria: 'Map of the world. Drag to move, scroll or pinch to zoom, click a country to select it.',
	home_aria: 'SampleSize_1 home page',
	'capitals.sub': 'Learn the capital of every country',
	'countries.sub': 'Find every country on the map',
	'flags.sub': 'Learn the flag of every country',
	loading: 'Loading',
	world_map: 'World map',
	answer_aria: 'Your answer',
	enter: 'Enter',
	r_misspelled: 'misspelled (½ point)',
	r_hint: 'Click any country to see how it went.',
	r_again: 'Go again',
	r_practice: 'Practise the misses',
	stat_acc: 'Accuracy',
	stat_time: 'Time',
	stat_streak: 'Streak',
	rail_aria: 'Regions',
	rail_title: 'Study one region at a time',
	flag_versions: 'Flag versions',
	versions_main: 'Main flag',
	versions_either: 'Either version',
	versions_main_hint: 'Flags with more than one version (a state and a civil flag, say) are asked about in their main version. The others show once you answer.',
	versions_either_hint: 'Flags with more than one version are asked about in any of them, at random.',
	rail_title_mix: 'Pick regions to combine',
	mix: 'Combine regions',
	mix_title: 'Pick several regions at once (or Ctrl/Cmd-click a region)',
	mix_click: 'Ctrl/Cmd-click to add it to the regions you have',
	view: 'View',
	names: 'Names',
	names_title: 'Names of oceans, seas, lakes and rivers on the map (L)',
	names_on: 'Water names on.',
	names_off: 'Water names off.',
	done: 'Done',
	globe: 'Globe',
	globe_title: '3D globe (G switches)',
	flat: 'Flat map',
	flat_title: 'Flat map (G switches)',
	zoom_to: 'Zoom to',
	zoom_out: 'Zoom −',
	zoom_out_title: 'Zoom out (−)',
	zoom_in: 'Zoom +',
	zoom_in_title: 'Zoom in (+)',
	reset: 'Reset view',
	reset_title: 'Back to the region you’re studying (Esc)',
	view_hint_narrow: 'Zoom only moves the map; the quiz carries on. Pinch to zoom, drag to move.',
	settings: 'Settings',
	// a language with names but no translated interface (shown in English, so {lang} is in its own name)
	lang_note: '', // (in other languages: that voice answers are English only)
	mode: 'Mode',
	mode_study: 'Study',
	mode_practice: 'Practice',
	mode_test: 'Test',
	questions: 'Questions',
	'capitals.fmt_click': 'Click the capital',
	'capitals.fmt_type': 'Type the capital',
	'countries.fmt_click': 'Click the country',
	'countries.fmt_type': 'Type the name',
	'flags.fmt_click': 'Click the country',
	'flags.fmt_type': 'Type the country',
	difficulty: 'Difficulty',
	easy: 'Easy',
	hard: 'Hard',
	find: 'Find a country',
	search_ph: 'Country or capital, e.g. Peru, Oslo',
	restart: 'Restart',
	clean: 'Clean view',
	// the credit line: {ne}, {cf} and {fi} are its links (Natural Earth, country-flags, flag-icons)
	'capitals.credit': 'Map: {ne} (public domain). Capitals checked October 2026. Made by @samplesize_1.',
	'countries.credit': 'Map: {ne} (public domain). The 197 countries of World Capitals. Made by @samplesize_1.',
	'flags.credit': 'Map: {ne} (public domain). Flags: {cf}, from Wikimedia Commons (public domain); Syria’s and Kyrgyzstan’s current flags from {fi} (MIT). Checked November 2026. Made by @samplesize_1.',
	// added to the credit in any other language
	names_credit: 'Names in other languages: Unicode CLDR (countries) and Natural Earth, from Wikidata (capitals, seas, lakes and rivers).',
	prev: 'Previous',
	next: 'Next',
	back: 'Back',
	skip: 'Skip',
	show_me: 'Show me',
	give_up: 'Give up',
	clean_exit: 'Exit clean view',
	confirm_title: 'End this test?',
	end_test: 'End test',
	keep_going: 'Keep going',

	/* ---------- regions ---------- */
	'region.world': 'World',
	'region.europe': 'Europe',
	'region.asia': 'Asia',
	'region.north-america': 'North America',
	'region.south-america': 'South America',
	'region.africa': 'Africa',
	'region.oceania': 'Oceania',
	'region.north-central-america': 'North & Central America',
	'region.caribbean': 'Caribbean',
	'region.northern-europe': 'Northern Europe',
	'region.western-europe': 'Western Europe',
	'region.southern-europe': 'Southern Europe',
	'region.eastern-europe': 'Eastern Europe',
	'region.east-asia': 'East Asia',
	'region.southeast-asia': 'Southeast Asia',
	'region.south-central-asia': 'South & Central Asia',
	'region.middle-east': 'Middle East',
	'region.north-africa': 'North Africa',
	'region.west-africa': 'West Africa',
	'region.east-africa': 'East Africa',
	'region.southern-africa': 'Southern Africa',
	'region.australia-melanesia': 'Australia & Melanesia',
	'region.micronesia-polynesia': 'Micronesia & Polynesia',
	'region.pacific': 'Pacific islands',

	/* ---------- the prompt and the quiz ---------- */
	nothing_to_study: 'Nothing to study here',
	pick_country: 'Pick a country',
	study_meta_all: { one: '{n} country · click it, or → to carry on', other: '{n} countries · click one, or ← → to carry on' },
	study_meta: '{i} of {n} · ← → to move, or click any country',
	no_countries: 'No countries in this selection',
	test_complete: 'Test complete',
	set_learned: 'Set learned',
	test_finished: 'Test finished',
	review_meta: '{acc}% accuracy · {time} · best {best}/{total}',
	n_of_n: '{a} of {n}',
	meta_answered: '{region} · {a}/{n} answered',
	meta_learned: '{region} · {a}/{n} learned',
	last_one: 'This is the last one left.',
	outside: 'That’s {name}, outside {region}.',
	not_that_glow: 'Not that one. Click the glowing country.',
	that_glow: 'That’s {name}. Click the glowing country.',
	not_that: 'Not that one.',
	type_to_go_on: 'Type “{answer}” to carry on.',
	correct_that: 'Correct, that’s {name}.',
	it_was: 'It was {name}.',
	r_correct: 'correct',
	r_first: 'first try',
	r_gave_up: 'gave up',
	r_missed: 'missed',
	r_needed_help: 'needed help',
	type_x: 'Type {answer}',
	flag_to_find: 'The flag to find',
	here_it_is: 'Here it is. Click the glowing country',
	type_it: 'Type it to carry on.',
	restarting: 'Restarting',
	switching_to: 'Switching to {region}',
	changing_mode: 'Changing mode',
	changing_format: 'Changing the question type',
	changing_level: 'Changing the difficulty',
	leaving: 'Leaving this page',
	// {what} is one of the six above
	confirm_msg: 'You’ve answered {a} of {n} ({region}). {what} ends this test, and it won’t count toward your best score.',
	hint_practice: 'Misses come back until you get them right. Countries you’ve missed before come up first.',
	hint_test: 'Every country in the region once, timed. Your best score is saved for each region.',
	hint_click_easy: 'Countries you’ve answered stay green or red, and a wrong click tells you which country it was.',
	hint_click_hard: 'Clicks flash green or red, but nothing stays coloured until the end and wrong clicks aren’t named: each question stands on its own.',
	hint_type_easy: 'Guess as often as you like, skip back and forth between countries (Enter with nothing typed skips), or give up to see the answer. A small misspelling turns the country yellow and counts as half a point.',
	// the keys: only the words between the <kbd> tags change
	keys: '<kbd>←</kbd><kbd>→</kbd> previous / next · <kbd>1</kbd>–<kbd>0</kbd> zoom · <kbd>+</kbd><kbd>−</kbd> zoom in / out · <kbd>Esc</kbd> deselect, then back to the region ·<kbd>G</kbd> globe / flat map · <kbd>V</kbd> voice · <kbd>L</kbd> water names · <kbd>C</kbd> clean view',
	// the same, where voice is English-only and so not offered
	no_best: 'No saved result for this selection yet.',
	best_here: 'Best here: <b>{score}/{total}</b> in <b>{time}</b>',
	lake_is: 'That’s {name}.',
	a_lake: 'That’s a lake.',
	not_country: '{name} isn’t a country in this quiz.',
	place_of: '{name} ({of})',

	/* ---------- typed answers ---------- */
	try_again: 'Try again.',
	not_quite: 'Not quite. Try again, skip it, or give up.',
	close_note: 'Close: it’s spelled {answer}. Half a point.',
	so_close_hard: 'So close, but Hard needs the exact spelling: {answer}.',

	/* ---------- World Capitals ---------- */
	'capitals.study_hint': 'Step through each country with the arrows, or click any country to see its capital. No score.',
	'capitals.click_hint': 'You get a capital; click its country. Small countries have a ring you can click.',
	'capitals.type_hint': 'A country lights up; type its capital. Accents don’t matter. On Easy, a small spelling slip counts as half a point.',
	'capitals.type_hard_hint': 'One try per country, spelled right (accents and capitals don’t matter). Enter with nothing typed gives up.',
	'capitals.placeholder': 'Type the capital',
	'capitals.click_ask': 'Click the country whose capital is',
	'capitals.type_ask': 'What’s the capital of',
	'capitals.type_reveal': 'The capital of {name} is',
	'capitals.capital_of': '{capital} is the capital of {name}.',
	'capitals.former': '{typed} used to be the capital.',
	'capitals.other': '{capital} is the capital of {name}.',
	'capitals.tell': '{name}’s capital is {capital}.',
	'capitals.fact': '{name}: {capital}.',
	'capitals.pair': '{name}: {capital}',
	'capitals.outside': '{name}: {capital}. It’s outside {region}.',
	'capitals.miss_click': 'It was {name}.',

	/* ---------- World Countries ---------- */
	'countries.study_hint': 'Step through each country with the arrows, or click any country to see its name. No score.',
	'countries.click_hint': 'You get a country’s name; click it on the map. Small countries have a ring you can click.',
	'countries.type_hint': 'A country lights up; type its name. Accents don’t matter, and short names count (UK, Ivory Coast). On Easy, a small spelling slip counts as half a point.',
	'countries.type_hard_hint': 'One try per country, spelled right (accents and capital letters don’t matter). Enter with nothing typed gives up.',
	'countries.placeholder': 'Type the country',
	'countries.click_ask': 'Click the country',
	'countries.type_ask': 'Type the name of',
	'countries.the_glowing': 'the glowing country',
	'countries.type_reveal': 'The glowing country is',
	'countries.former': '{typed} is an old name.',
	'countries.other': '{name} is somewhere else.',
	'countries.tell': 'This is {name}.',
	'countries.fact': 'That’s {name}.',
	'countries.outside': 'That’s {name}, outside {region}.',
	'countries.miss_click': 'That’s {clicked}.',

	/* ---------- World Flags ---------- */
	'flags.study_hint': 'Step through each country with the arrows, or click any country to see its flag. No score.',
	'flags.click_hint': 'You get a flag; click its country. Small countries have a ring you can click.',
	'flags.type_hint': 'You get a flag; type the country’s name. Accents don’t matter, and short names count (UK, Ivory Coast). On Easy, a small spelling slip counts as half a point.',
	'flags.type_hard_hint': 'One try per flag, the country spelled right (accents and capital letters don’t matter). Enter with nothing typed gives up.',
	'flags.placeholder': 'Type the country',
	'flags.click_ask': 'Click the country with this flag',
	'flags.type_ask': 'Whose flag is this?',
	'flags.type_reveal': 'This is the flag of',
	'flags.former': '{typed} is an old name.',
	'flags.other': 'That’s not {name}’s flag.',
	'flags.tell': 'It’s the flag of {name}.',
	'flags.fact': 'That’s the flag of {name}.',
	'flags.outside': 'That’s {name}, outside {region}.',
	'flags.miss_click': 'That’s {clicked}. It was {name}.',
	// note.<id> (a capital's note, from countries.json) and flag.<id> (subjects.js) are added below
};

/* ---------------- the language in use ---------------- */
// app.js opens it (/js/language.js) and hands it over here
let L = null;
export function useLanguage(lang) {
	L = lang;
}
const names = () => (L && L.file(0)) || {};
// Text for a key, in the language in use, with {name}s filled in
export const t = (key, vars) => (L ? L.t(key, vars) : key);
// its code ('fr'), and its BCP 47 tag for sorting and capital letters ('zh-Hant')
export const lang = () => (L ? L.code : 'en');
export const locale = () => (L ? L.locale : 'en');
// A translated text that has no English key here (the notes: their English is in countries.json and
// subjects.js), or undefined
export const uiText = (key) => names().ui?.[key];

/* ---------------- names ---------------- */
// a country's name and its capital, in the language in use (English where a source has no translation)
export const nameOf = (c) => names().countries?.[c.id]?.[0] || c.name;
export const capitalOf = (c) => names().capitals?.[c.id]?.[0] || c.capital;
// every name of each that counts as a typed answer in this language (English ones count too: see subjects.js)
export const nameForms = (c) => names().countries?.[c.id] || [];
export const capitalForms = (c) => names().capitals?.[c.id] || [];
// the map's other places (Greenland, Puerto Rico…), and the names of seas, lakes and rivers, by their English name
export const placeName = (en) => (en && names().places?.[en]) || en;
export const waterName = (en) => (en && names().water?.[en]) || en;
