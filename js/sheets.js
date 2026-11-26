// Preferences and Keys: two small buttons under Restart that open a window each, so the settings panel only
// holds what's changed often. Shared by every tool; each page loads it after its panel (and after hints.js).
//  - Keys: the keyboard shortcuts, as a table. They're read from the line each tool writes them into
//    (#keysHint, or States & Provinces' p.keys), which is then hidden; a change of language rewrites it.
//  - Preferences: the language, World Flags' flag versions, and whether the settings' explanations are
//    folded behind an "i" (hints.js) or always shown. The language and flag-version controls are moved into
//    the window as they are, so the tool's own code keeps running them.
(function () {
	const restart = document.getElementById('restartBtn');
	const keysSrc = document.getElementById('keysHint') || document.querySelector('.panel p.keys');
	if (!restart) return;

	const style = document.createElement('style');
	style.textContent = `
.sheet-links { display: flex; gap: 6px; margin-top: 10px; }
.sheet-links .btn { flex: 1; font-size: 12px; padding: 6px 8px; color: var(--muted, #8d9ca9); background: transparent; }
.sheet-links .btn:hover { color: var(--fg, #e8edf0); border-color: var(--scan, #6fd0e8); }
dialog.sheet-dlg { box-sizing: border-box; width: min(440px, calc(100vw - 32px)); max-height: 86vh; overflow-y: auto; padding: 20px 22px 22px;
	color: var(--fg, #e8edf0); background: var(--bg-lift, #121b23); border: 1px solid var(--line-strong, #33475a); border-radius: 14px; }
dialog.sheet-dlg::backdrop { background: rgba(6, 10, 14, 0.62); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); }
.sheet-dlg .sheet-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.sheet-dlg h2 { margin: 0; font-weight: 800; font-stretch: 118%; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--scan, #6fd0e8); }
.sheet-dlg .sheet-x { font: inherit; font-size: 12px; color: var(--muted, #8d9ca9); background: none; border: 1px solid var(--line-strong, #33475a); border-radius: 7px; padding: 5px 10px; cursor: pointer; }
.sheet-dlg .sheet-x:hover { color: var(--fg, #e8edf0); }
.sheet-dlg section { margin: 0 0 16px; padding: 0; border: 0; background: none; }
.sheet-dlg section:last-child { margin-bottom: 0; }
.sheet-dlg section[hidden] { display: none; }
.sheet-dlg .hint { display: block !important; }
.sheet-dlg .hint-i { display: none; }
.keys-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.keys-table td { padding: 7px 0; border-top: 1px solid var(--line, #223140); vertical-align: middle; }
.keys-table tr:first-child td { border-top: 0; }
.keys-table td:first-child { white-space: nowrap; padding-right: 14px; width: 1%; }
.keys-table td:last-child { color: var(--muted, #8d9ca9); }
.keys-table kbd { margin-right: 3px; }
body.hints-shown .hint.folded { display: block; }
body.hints-shown .hint-i { display: none; }`;
	document.head.appendChild(style);

	function dialog(title) {
		const d = document.createElement('dialog');
		d.className = 'sheet-dlg';
		d.setAttribute('aria-label', title);
		d.innerHTML = `<div class="sheet-head"><h2></h2><button type="button" class="sheet-x">Close</button></div><div class="sheet-body"></div>`;
		d.querySelector('h2').textContent = title;
		d.querySelector('.sheet-x').addEventListener('click', () => d.close());
		d.addEventListener('click', (e) => e.target === d && d.close()); // a click on the backdrop
		d.addEventListener('keydown', (e) => e.stopPropagation()); // keys typed here aren't the map's shortcuts
		document.body.appendChild(d);
		return d;
	}
	const open = (d) => (d.showModal ? d.showModal() : d.setAttribute('open', ''));

	// ---- Keys ----
	const keys = dialog('Keys');
	const table = document.createElement('table');
	table.className = 'keys-table';
	keys.querySelector('.sheet-body').appendChild(table);
	function renderKeys() {
		if (!keysSrc) return;
		table.replaceChildren();
		for (const part of keysSrc.innerHTML.split('·')) {
			const tmp = document.createElement('div');
			tmp.innerHTML = part.trim();
			if (!tmp.querySelector('kbd')) continue;
			// the keys go in the first column (with the dash of a range like 1–0), the words in the second
			const k = document.createElement('td'), words = [];
			for (const n of tmp.childNodes) {
				if (n.nodeName === 'KBD') k.appendChild(n.cloneNode(true));
				else if (n.textContent.trim() === '–' && n.nextSibling?.nodeName === 'KBD') k.append('– ');
				else words.push(n.textContent);
			}
			const tr = table.insertRow();
			tr.appendChild(k);
			tr.insertCell().textContent = words.join('').trim();
		}
	}
	if (keysSrc) {
		renderKeys();
		new MutationObserver(renderKeys).observe(keysSrc, { childList: true, characterData: true, subtree: true });
		keysSrc.hidden = true;
	}

	// ---- Preferences ----
	const prefs = dialog('Preferences');
	const body = prefs.querySelector('.sheet-body');
	const lang = document.getElementById('langSel')?.closest('section');
	if (lang) body.appendChild(lang);
	// World Flags' flag versions, World Currencies' typed answers
	for (const id of ['versionBox', 'acceptBox']) {
		const box = document.getElementById(id);
		if (box) body.appendChild(box);
	}
	const KEY = 'geography-tools.hintsShown';
	let shown = false;
	try {
		shown = localStorage.getItem(KEY) === '1';
	} catch {}
	const hintsBox = document.createElement('section');
	hintsBox.innerHTML = `<h3>Setting explanations</h3>
<div class="seg" id="hintsSeg"><button type="button" data-v="folded">Behind an i</button><button type="button" data-v="shown">Always shown</button></div>`;
	body.appendChild(hintsBox);
	const seg = hintsBox.querySelector('.seg');
	function renderHints() {
		document.body.classList.toggle('hints-shown', shown);
		for (const b of seg.querySelectorAll('button')) b.setAttribute('aria-pressed', String((b.dataset.v === 'shown') === shown));
	}
	seg.addEventListener('click', (e) => {
		const b = e.target.closest('button[data-v]');
		if (!b) return;
		shown = b.dataset.v === 'shown';
		try {
			localStorage.setItem(KEY, shown ? '1' : '0');
		} catch {}
		renderHints();
	});
	renderHints();

	// ---- the two buttons, under Restart ----
	const links = document.createElement('div');
	links.className = 'sheet-links';
	links.innerHTML = `<button type="button" class="btn" id="prefsBtn">Preferences</button>`;
	if (keysSrc) links.insertAdjacentHTML('beforeend', `<button type="button" class="btn" id="keysBtn">Keys</button>`);
	(restart.closest('.row') || restart).after(links);
	links.querySelector('#prefsBtn').addEventListener('click', () => open(prefs));
	links.querySelector('#keysBtn')?.addEventListener('click', () => open(keys));
})();
