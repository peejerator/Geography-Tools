// States & Provinces: pick a country, then learn its first-level subdivisions on the map.
// One state object, one named action per control. The quiz rules are in core/session.js, the
// answer checking in core/answer.js, the drawing in map.js. Data: data/index.json (the countries)
// and data/sub/<ID>.json (one country, loaded when it's picked); the world's country shapes are
// the World Capitals map's own files, so the borders are the same.
import { feature } from '../../capital-atlas/geo.js';
import { createMap, COL, rewind, mainCluster } from './map.js';
import { norm } from './core/answer.js';
import { newSession, current, finished, answerClick, answerType, giveUp, skip, summary, better } from './core/session.js';
import { EN, t, useLanguage, language, unitName, unitForms, countryName, countryForms, placeName, lakeName, typeName, kindCount, kindWhich } from './text.js';

const $ = (id) => document.getElementById(id);
const saved = window.SiteProgress ? window.SiteProgress.tool('state-atlas') : { get: (k, d) => d, set() {} };
const CONTINENTS = ['north-america', 'south-america', 'asia', 'europe', 'africa', 'oceania'];

const state = {
	countries: [], // [{ id, name, region, count, kind }]
	none: [], // countries with nothing to learn
	byId: new Map(),
	open: null, // the country being studied: { id, name, kind, units: [{ name, alts?, type? }] }
	mode: ['study', 'practice', 'test'].includes(saved.get('mode')) ? saved.get('mode') : 'study',
	format: saved.get('format') === 'type' ? 'type' : 'click',
	names: false, // Study: every name on the map
	selected: null, // Study and review: the unit being looked at
	session: null,
	review: null, // the finished round: { sum, ms, best }
	flash: null, // { i, color, until }
	hover: null,
	startedAt: 0,
	collapsed: new Set(),
};
const loaded = new Map(); // country id -> its data

const narrow = () => window.innerWidth <= 900;
let spinning = false; // the hidden spinning globe (see "spinning globe" below)
function insets() {
	if (spinning) return { left: 0, right: 0, top: 0, bottom: 0 }; // it has the whole screen
	const pr = $('prompt').getBoundingClientRect();
	if (narrow()) return { left: 10, right: 10, top: pr.bottom + 10, bottom: 74 };
	// the panels at either side (#left is on the right in a right-to-left language)
	const [l, r] = [$('left').getBoundingClientRect(), $('right').getBoundingClientRect()].sort((a, b) => a.left - b.left);
	return { left: l.right + 16, right: window.innerWidth - r.left + 16, top: pr.bottom + 14, bottom: 64 };
}

const view = {
	country: (c) => (!c.id ? COL.territory : state.open ? COL.other : state.byId.has(c.id) ? (state.hover && state.hover.country === c.id ? '#e2d8c0' : COL.land) : COL.landOff),
	fill(i) {
		const f = state.flash;
		if (f && f.i === i && performance.now() < f.until) return f.color;
		const s = state.session, shown = s || state.review;
		const r = shown && (state.review ? state.review.result : s.result).get(i);
		if (r) return r === 'ok' ? COL.ok : r === 'close' ? COL.close : COL.bad;
		return state.hover && state.hover.unit === i ? '#e2d8c0' : COL.land;
	},
	// the province lit up: the one being asked about (typing) or looked at. fill: washed blue all over;
	// in the results it keeps its right/wrong colour and only its edge lights
	lit() {
		const s = state.session;
		if (s && !state.review && s.format === 'type' && current(s) != null) return [{ i: current(s), fill: true }];
		return state.selected != null ? [{ i: state.selected, fill: !state.review }] : [];
	},
	callouts() {
		if (state.selected == null || !state.open) return [];
		if (state.session && !state.review) return [];
		return [{ i: state.selected, text: unitName(state.open.units[state.selected]) }];
	},
	names: () => state.names && state.mode === 'study' && !!state.open,
};

// The World Capitals map's other files, fetched when the map first wants them: its finer country
// shapes (zoomed in) and its lakes and rivers. A failed fetch only means the coarser picture stays.
const CAPITALS = '../capital-atlas/data/';
function fetchForMap(file) {
	fetch(CAPITALS + file + '.json')
		.then((r) => r.json())
		.then((t) => {
			if (file.startsWith('water-')) map.setWater(file.slice(6), feature(t, t.objects.lakes).features, feature(t, t.objects.rivers).features);
			else map.setWorldDetail(file.slice(4), feature(t, t.objects.land).features);
		})
		.catch(() => {});
}
const map = createMap({ canvas: $('map'), insets, view, onClick: clickMap, onHover: hoverMap, need: fetchForMap });

/* ---------- small helpers ---------- */
let toastTimer = 0;
function toast(msg, kind = '') {
	const t = $('toast');
	t.textContent = msg;
	t.className = 'toast show ' + kind;
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}
let pulseTimer = 0;
function pulse(kind) {
	const p = $('prompt');
	p.classList.remove('is-ok', 'is-bad', 'is-close');
	p.classList.add('is-' + kind);
	clearTimeout(pulseTimer);
	pulseTimer = setTimeout(() => p.classList.remove('is-ok', 'is-bad', 'is-close'), 600);
}
function flash(i, color, ms = 700) {
	state.flash = { i, color, until: performance.now() + ms };
	map.invalidate();
	setTimeout(() => map.invalidate(), ms + 30);
}
const clock = (ms) => `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}`;
const points = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
const bestKey = () => `${state.open.id}|${state.mode}|${state.format}`;

/* ---------- actions ---------- */
async function openCountry(id, { animate = true } = {}) {
	const meta = state.byId.get(id);
	if (!meta) return;
	setSheet(null);
	let data = loaded.get(id);
	if (!data) {
		$('pMeta').textContent = t('loading_country', { name: countryName(meta) });
		try {
			const res = await fetch(`data/sub/${id}.json`);
			if (!res.ok) throw new Error(res.status);
			data = await res.json();
		} catch (err) {
			toast(t('load_country_fail', { name: countryName(meta) }), 'bad');
			render();
			return;
		}
		const fc = feature(data.topology, data.topology.objects.units);
		fc.features.forEach((f, i) => {
			f.properties = { name: unitName(data.units[i]) };
			rewind(f);
		});
		data.features = fc.features;
		// what the view is fitted to: the country without one or two far-off units
		const main = mainCluster(fc.features);
		data.shape = main.shape;
		data.far = main.far;
		loaded.set(id, data);
	}
	state.open = data;
	state.selected = null;
	state.session = state.review = null;
	saved.set('country', id);
	if (location.hash !== '#selftest') history.replaceState(null, '', '#' + id);
	map.setUnits(data.features, id);
	render(); // first, so the prompt has its real height when the view is fitted under it
	const row = $('list').querySelector('button[aria-pressed="true"]');
	if (row) row.scrollIntoView({ block: 'nearest' });
	map.frame(data.shape, animate);
	if (state.mode !== 'study') startRound();
}
function closeCountry() {
	state.open = null;
	state.selected = null;
	state.session = state.review = null;
	saved.set('country', null);
	if (location.hash !== '#selftest') history.replaceState(null, '', location.pathname);
	map.setUnits([], null);
	render();
	map.frame(null);
}
// Esc with a country open: back to the whole globe. A round with answers already in it asks for a second press first,
// so one stray key doesn't throw a test away.
let leaveAsked = -Infinity;
function escCountry() {
	const s = state.session;
	const midRound = s && !state.review && (s.result.size > 0 || s.wrongNow);
	if (midRound && performance.now() - leaveAsked > 3000) {
		leaveAsked = performance.now();
		toast(t('esc_again'));
		return;
	}
	leaveAsked = -Infinity;
	closeCountry();
}
function setMode(mode) {
	state.mode = mode;
	saved.set('mode', mode);
	state.selected = null;
	state.session = state.review = null;
	if (state.open && mode !== 'study') startRound();
	else render();
}
function setFormat(format) {
	state.format = format;
	saved.set('format', format);
	if (state.open && state.mode !== 'study') startRound();
	else render();
}
// A country's regions as a round asks them: each with its names in the language in use as other answers
// (its English names always count)
const askable = (o) => o.units.map((u) => ({ ...u, alts: [...(u.alts || []), ...unitForms(u)] }));
function startRound(only = null) {
	state.session = newSession(askable(state.open), { mode: state.mode, format: state.format, only });
	state.review = null;
	state.selected = null;
	state.startedAt = performance.now();
	render();
	showCurrent();
}
function showCurrent() {
	const s = state.session;
	if (!s || finished(s)) return;
	if (s.format === 'type') {
		map.lookAt(current(s));
		$('answer').value = '';
		if (!narrow() || document.activeElement === $('answer')) $('answer').focus({ preventScroll: true });
	}
	map.invalidate();
}
function endRound() {
	const s = state.session, sum = summary(s), ms = performance.now() - state.startedAt;
	const all = saved.get('best', {});
	const mine = { score: sum.score, total: sum.total, ms: Math.round(ms) };
	const whole = sum.total === state.open.units.length; // a "practise the misses" round doesn't count as a best
	const isBest = whole && better(mine, all[bestKey()]);
	if (isBest) {
		all[bestKey()] = mine;
		saved.set('best', all);
	}
	state.review = { sum, ms, result: s.result, isBest };
	state.selected = null;
	render();
}
// After any answer: feedback, then the next question or the results
function afterAnswer(res, pickedName) {
	const s = state.session, name = unitName(state.open.units[res.target]);
	if (res.outcome === 'ok') {
		flash(res.target, COL.ok);
		pulse('ok');
	} else if (res.outcome === 'close') {
		flash(res.target, COL.close);
		pulse('close');
		toast(t('close_spelling', { name }), 'close');
	} else if (res.outcome === 'gaveup') {
		flash(res.target, COL.bad, 1100);
		map.lookAt(res.target);
		toast(t(s.format === 'type' ? 'its_name' : 'is_here', { name }), 'bad');
	} else {
		pulse('bad');
		if (res.moved) {
			flash(res.target, COL.bad, 1100);
			toast(s.format === 'type' ? t('its_name', { name }) : t('marked_red', { picked: pickedName, name }), 'bad');
		} else toast(s.format === 'type' ? t('not_that_type') : t('not_that_click', { picked: pickedName }), 'bad');
	}
	if (finished(s)) endRound();
	else {
		render();
		if (res.moved) showCurrent();
	}
}
function clickMap(hit) {
	if (!hit) return;
	// the same words as World Capitals for a lake, and for land that is no country's (Greenland, Western Sahara)
	if (hit.lake != null) return toast(hit.lake ? t('lake_is', { name: lakeName(hit.lake) }) : t('a_lake'));
	if (hit.place) return toast(t('not_country', { name: hit.of && hit.of !== hit.place ? t('place_of', { name: placeName(hit.place), of: placeName(hit.of) }) : placeName(hit.place) }));
	if (hit.country) {
		if (state.open) return; // while a country is open, the rest of the world is just background
		return openCountry(hit.country);
	}
	const i = hit.unit, s = state.session;
	if (s && !state.review) {
		if (s.format !== 'click') return;
		if (s.result.has(i) && s.result.get(i) !== 'bad' && current(s) !== i) return toast(t('already_done', { name: unitName(state.open.units[i]) }));
		const res = answerClick(s, i);
		if (res) afterAnswer(res, unitName(state.open.units[i]));
		return;
	}
	state.selected = state.selected === i ? null : i;
	render();
}
function hoverMap(hit) {
	// only what a click would pick lights up: a province, or a country on the world view (not a lake, nor land that is no country's)
	const live = hit && (hit.unit != null ? !(state.session && !state.review && state.session.format === 'type') : hit.country ? !state.open : false);
	const next = live ? hit : null;
	if (JSON.stringify(next) === JSON.stringify(state.hover)) return;
	state.hover = next;
	$('stage').classList.toggle('hovering', !!next);
	map.invalidate();
}
function submitTyped() {
	const s = state.session;
	if (!s || state.review) return;
	const res = answerType(s, $('answer').value);
	if (!res) return;
	if (res.outcome === 'empty') return doSkip();
	if (res.moved || res.outcome === 'wrong') $('answer').select();
	afterAnswer(res);
}
function doSkip() {
	const s = state.session;
	if (!s || state.review) return;
	if (!skip(s)) return toast(t('last_one'));
	render();
	showCurrent();
}
function doGiveUp() {
	const s = state.session;
	if (!s || state.review) return;
	afterAnswer(giveUp(s));
}
function studyStep(d) {
	if (!state.open || (state.session && !state.review)) return;
	const n = state.open.units.length;
	state.selected = state.selected == null ? (d > 0 ? 0 : n - 1) : (state.selected + d + n) % n;
	map.lookAt(state.selected);
	render();
}
function setNames(on) {
	state.names = on;
	render();
}
function setSheet(which) {
	document.body.classList.toggle('sheet-countries', which === 'countries');
	document.body.classList.toggle('sheet-options', which === 'options');
}

/* ---------- drawing the page ---------- */
function renderList() {
	const q = norm($('search').value).replace(/ /g, '');
	const frag = document.createDocumentFragment();
	for (const key of CONTINENTS) {
		const label = t('continent.' + key);
		const all = state.countries.filter((c) => c.region === key);
		// found by its name in the language in use or in English; listed by the name shown
		const rows = all
			.filter((c) => !q || [c.name, ...countryForms(c)].some((n) => norm(n).replace(/ /g, '').includes(q)))
			.sort((a, b) => countryName(a).localeCompare(countryName(b), language().locale));
		if (!rows.length) continue;
		const shut = !q && state.collapsed.has(key);
		const h = document.createElement('h3');
		const hb = document.createElement('button');
		hb.type = 'button';
		hb.dataset.group = key;
		hb.setAttribute('aria-expanded', String(!shut));
		hb.innerHTML = `<span>${label}</span><em>${rows.length}${shut ? ' ▸' : ''}</em>`;
		h.append(hb);
		frag.append(h);
		if (shut) continue;
		const ul = document.createElement('ul');
		for (const c of rows) {
			const li = document.createElement('li'), b = document.createElement('button');
			b.type = 'button';
			b.dataset.id = c.id;
			b.setAttribute('aria-pressed', String(!!state.open && state.open.id === c.id));
			const name = document.createElement('span'), n = document.createElement('em');
			name.textContent = countryName(c);
			n.textContent = c.count;
			b.append(name, n);
			li.append(b);
			ul.append(li);
		}
		frag.append(ul);
	}
	if (!q && state.none.length) {
		const p = document.createElement('p');
		p.className = 'none';
		p.textContent = t('nothing_in', { names: language().join(state.none.map(countryName)) });
		frag.append(p);
	}
	if (!frag.childNodes.length) {
		const p = document.createElement('p');
		p.className = 'none';
		p.textContent = t('no_match');
		frag.append(p);
	}
	$('list').replaceChildren(frag);
}
function renderPrompt() {
	const o = state.open, s = state.session, rv = state.review;
	const quiz = !!s && !rv;
	$('answerForm').hidden = !(quiz && s.format === 'type');
	$('quizRow').hidden = !quiz;
	$('review').hidden = !rv;
	$('pBar').hidden = !quiz;
	$('prevBtn').hidden = $('nextBtn').hidden = !o || quiz;
	if (!o) {
		const total = state.countries.reduce((n, c) => n + c.count, 0);
		$('pEyebrow').textContent = t('title');
		$('pName').textContent = t('pick_country');
		$('pMeta').textContent = state.countries.length
			? t('overview', { countries: state.countries.length, regions: total.toLocaleString(language().locale), how: t(narrow() ? 'overview_narrow' : 'overview_wide') })
			: t('loading');
		return;
	}
	$('pEyebrow').textContent = t('eyebrow', { mode: t('mode_' + state.mode), country: countryName(o) });
	if (rv) {
		$('pName').textContent = t('score', { score: points(rv.sum.score), total: rv.sum.total });
		const best = saved.get('best', {})[bestKey()];
		const was = rv.isBest ? t('your_best') : best ? t('best_was', { score: points(best.score), total: best.total, time: clock(best.ms) }) : '';
		$('pMeta').textContent = [clock(rv.ms), was, t('click_region')].filter(Boolean).join(' · ');
		$('rOk').textContent = rv.sum.ok;
		$('rClose').textContent = rv.sum.close;
		$('rCloseKey').hidden = !rv.sum.close;
		$('rBad').textContent = rv.sum.bad;
		$('missedBtn').hidden = !rv.sum.missed.length;
		if (state.selected != null) $('pName').textContent = unitName(o.units[state.selected]);
		return;
	}
	if (quiz) {
		const i = current(s), done = s.total - new Set(s.queue).size;
		$('pName').textContent = s.format === 'click' ? unitName(o.units[i]) : kindWhich(o.kind, o.id);
		$('pMeta').textContent = `${t('n_of', { i: Math.min(done + 1, s.total), n: s.total })} · ${t(s.format === 'click' ? 'how_click' : 'how_type')}`;
		$('pBarFill').style.width = `${(100 * done) / s.total}%`;
		return;
	}
	if (state.selected == null) {
		$('pName').textContent = kindCount(o.kind, o.units.length, o.id);
		const far = o.far.map((i) => unitName(o.units[i])).sort((a, b) => a.localeCompare(b, language().locale));
		$('pMeta').textContent = far.length
			? t('far_off', { n: far.length, names: language().join(far) })
			: t(narrow() ? 'tap_region' : 'step_hint');
	} else {
		const u = o.units[state.selected], shown = unitName(u);
		// its other names: the English one where another language's is shown, then the map data's
		const also = [...new Set([u.name, ...(u.alts || [])])].filter((n) => norm(n) !== norm(shown)).slice(0, 2);
		$('pName').textContent = shown;
		$('pMeta').textContent = [t('n_of', { i: state.selected + 1, n: o.units.length }), typeName(u.type), also.length ? t('also', { names: also.join(', ') }) : ''].filter(Boolean).join(' · ');
	}
}
function renderStats() {
	const s = state.session, rv = state.review;
	if (!s) {
		$('sScore').textContent = '–';
		$('sTime').textContent = '0:00';
		$('sStreak').textContent = '0';
		return;
	}
	const sum = summary(s);
	$('sScore').textContent = `${points(sum.score)}/${s.total}`;
	$('sTime').textContent = clock(rv ? rv.ms : performance.now() - state.startedAt);
	$('sStreak').textContent = s.streak;
}
function renderControls() {
	for (const [id, v] of [['modeSeg', state.mode], ['formatSeg', state.format]]) {
		for (const b of $(id).querySelectorAll('button')) b.setAttribute('aria-pressed', String(b.dataset.v === v));
	}
	$('modeHint').textContent = t('hint_' + state.mode);
	$('formatHint').textContent = t(state.mode === 'study' ? 'format_in_study' : 'hint_' + state.format);
	// Study asks nothing, so the question types (their name, buttons and explanation) are hidden
	for (const el of [$('formatSeg').previousElementSibling, $('formatSeg'), $('formatHint')]) el.hidden = state.mode === 'study';
	$('restartBtn').disabled = !state.open || state.mode === 'study';
	$('namesBtn').disabled = !state.open || state.mode !== 'study';
	$('namesBtn').setAttribute('aria-pressed', String(view.names()));
	$('worldBtn').disabled = !state.open;
	const best = state.open && state.mode !== 'study' ? saved.get('best', {})[bestKey()] : null;
	$('bestLine').textContent = best ? t('best_here', { score: points(best.score), total: best.total, time: clock(best.ms) }) : '';
	$('bestLine').hidden = !best;
}
function render() {
	renderList();
	renderPrompt();
	renderStats();
	renderControls();
	map.invalidate();
}
setInterval(() => {
	if (state.session && !state.review) renderStats();
}, 500);

/* ---------- controls ---------- */
$('list').addEventListener('click', (e) => {
	const g = e.target.closest('button[data-group]');
	if (g) {
		state.collapsed[state.collapsed.has(g.dataset.group) ? 'delete' : 'add'](g.dataset.group);
		return renderList();
	}
	const b = e.target.closest('button[data-id]');
	if (b) openCountry(b.dataset.id);
});
$('search').addEventListener('input', renderList);
$('modeSeg').addEventListener('click', (e) => {
	const b = e.target.closest('button[data-v]');
	if (b && b.dataset.v !== state.mode) setMode(b.dataset.v);
});
$('formatSeg').addEventListener('click', (e) => {
	const b = e.target.closest('button[data-v]');
	if (b && b.dataset.v !== state.format) setFormat(b.dataset.v);
});
$('answerForm').addEventListener('submit', (e) => {
	e.preventDefault();
	submitTyped();
});
$('skipBtn').addEventListener('click', doSkip);
$('giveUpBtn').addEventListener('click', doGiveUp);
$('againBtn').addEventListener('click', () => startRound());
$('missedBtn').addEventListener('click', () => {
	const missed = state.review.sum.missed;
	state.mode = 'practice';
	saved.set('mode', 'practice');
	startRound(missed);
});
$('studyBtn').addEventListener('click', () => setMode('study'));
$('restartBtn').addEventListener('click', () => state.open && state.mode !== 'study' && startRound());
$('namesBtn').addEventListener('click', () => setNames(!state.names));
$('prevBtn').addEventListener('click', () => studyStep(-1));
$('nextBtn').addEventListener('click', () => studyStep(1));
$('zoomIn').addEventListener('click', () => map.zoomBy(1.4));
$('zoomOut').addEventListener('click', () => map.zoomBy(1 / 1.4));
$('resetView').addEventListener('click', () => map.frame(state.open ? state.open.shape : null));
$('worldBtn').addEventListener('click', closeCountry);
$('countriesBtn').addEventListener('click', () => setSheet('countries'));
$('optionsBtn').addEventListener('click', () => setSheet('options'));
for (const b of document.querySelectorAll('[data-close]')) b.addEventListener('click', () => setSheet(null));

/* ---------- spinning globe (hidden) ---------- */
// S on the world globe (no country open), as on World Capitals: everything but the globe fades away and
// it turns on its own, every country's subdivisions drawn in thin lines and no names. S again goes faster
// (three speeds); Space pauses it and starts it again; Esc stops it and puts the view back. Dragging and zooming still work; clicks pick
// nothing. Not listed in the key hints. The lines (data/borders.json) are fetched the first time.
let bordersAsked = false;
function startSpin() {
	if (spinning || state.open || !state.countries.length) return;
	if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
	spinning = true;
	setSheet(null);
	state.hover = null;
	$('stage').classList.remove('hovering');
	document.body.classList.add('spinning');
	map.spinStart();
	if (!bordersAsked) {
		bordersAsked = true;
		fetch('data/borders.json')
			.then((r) => r.json())
			.then((doc) => map.setBorders(doc))
			.catch(() => (bordersAsked = false)); // try again next time; the globe spins without them
	}
}
function stopSpin() {
	if (!spinning) return;
	spinning = false;
	document.body.classList.remove('spinning');
	map.spinStop();
}

document.addEventListener('keydown', (e) => {
	const typing = /^(INPUT|TEXTAREA)$/.test(e.target.tagName);
	if (spinning) {
		// while the globe spins: S goes faster, Space pauses, Esc stops it, + and − zoom; nothing else
		const plain = !e.metaKey && !e.ctrlKey && !e.altKey;
		if (e.key === 'Escape') stopSpin();
		else if ((e.key === 's' || e.key === 'S') && plain) map.spinFaster();
		else if (e.key === ' ' && plain) {
			if (!e.repeat) map.spinPause(); // held down, it doesn't flicker between paused and turning
		}
		else if (e.key === '+' || e.key === '=') map.zoomBy(1.25);
		else if (e.key === '-' || e.key === '_') map.zoomBy(1 / 1.25);
		else return;
		e.preventDefault();
		return;
	}
	if (e.key === 'Escape') {
		if (document.body.classList.contains('sheet-countries') || document.body.classList.contains('sheet-options')) setSheet(null);
		else if (state.selected != null) {
			state.selected = null;
			render();
		} else if (state.open) escCountry();
		else map.frame(null);
		return;
	}
	if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
	if (e.key === 'ArrowRight' || e.key === 'ArrowDown') studyStep(1);
	else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') studyStep(-1);
	else if (e.key === '+' || e.key === '=') map.zoomBy(1.25);
	else if (e.key === '-' || e.key === '_') map.zoomBy(1 / 1.25);
	else if ((e.key === 'n' || e.key === 'N') && !$('namesBtn').disabled) setNames(!state.names);
	else if ((e.key === 's' || e.key === 'S') && !state.open) startSpin(); // the hidden spinning globe (world globe only)
	else return;
	e.preventDefault();
});
window.addEventListener('resize', () => {
	if (!narrow()) setSheet(null);
});

/* ---------- start ---------- */
// where the names come from, after the credit line, when they are in another language than English
function nameCredit() {
	const credit = document.querySelector('[data-i18n-html="credit"]');
	if (!credit) return;
	credit.querySelector('.names-credit')?.remove();
	if (language().code === 'en') return;
	const span = document.createElement('span');
	span.className = 'names-credit';
	span.textContent = ' ' + t('names_credit');
	credit.append(span);
}
async function boot() {
	const [index, low, lang] = await Promise.all([
		fetch('data/index.json').then((r) => r.json()),
		fetch(CAPITALS + 'map-low.json').then((r) => r.json()),
		// the page's words, in the language picked (/js/language.js, which the page started)
		// the page's words and the regions' names in the language picked (/js/language.js, which the page started),
		// and World Capitals' names of countries, places and lakes in it
		SiteLanguage.open({ layers: [{ text: EN, files: new URL('../lang/', import.meta.url) }, { files: new URL('../../capital-atlas/lang/', import.meta.url) }] }),
	]);
	useLanguage(lang);
	nameCredit();
	lang.onChange(() => {
		nameCredit();
		// the map's labels and a round's answers follow the new language; the round itself carries on
		for (const d of loaded.values()) d.features.forEach((f, i) => (f.properties.name = unitName(d.units[i])));
		if (state.session && state.open) state.session.units = askable(state.open);
		render();
	});
	state.countries = index.countries;
	state.none = index.none;
	state.byId = new Map(index.countries.map((c) => [c.id, c]));
	const names = new Map([...index.countries, ...index.none].map((c) => [c.id, c.name]));
	map.setWorld(feature(low, low.objects.land).features.map((f) => ({ id: f.properties.id || null, name: names.get(f.properties.id) || f.properties.name, of: f.properties.of, feature: f })));
	map.resize();
	render();
	map.frame(null, false);
	$('loading').hidden = true;
	fetchForMap('water-low');
	const want = /^#[A-Z]{3}$/.test(location.hash) ? location.hash.slice(1) : saved.get('country', null);
	if (want && state.byId.has(want)) await openCountry(want, { animate: false });
	if (location.hash === '#selftest') {
		window.__stateAtlas = { state, map, view, openCountry, closeCountry, setMode, setFormat, startRound, clickMap, studyStep, loaded, current, summary, startSpin, stopSpin };
	}
}
boot().catch((err) => {
	console.error(err);
	$('loadingText').textContent = SiteLanguage.bootText('load_fail');
});
