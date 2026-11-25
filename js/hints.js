// The explanations under each setting (Mode, Questions, Difficulty...) are folded away behind a small circled
// "i" beside the setting's name, so the panel isn't a wall of text. Clicking it shows or hides that one.
// Shared by every tool: each page loads it after its panel.
(function () {
	const IDS = ['modeHint', 'formatHint', 'levelHint', 'versionHint'];
	const style = document.createElement('style');
	style.textContent = `
.hint-i { display: inline-grid; place-items: center; width: 15px; height: 15px; margin: -2px 0 0 7px; padding: 0;
	vertical-align: middle; border: 1px solid currentColor; border-radius: 50%; background: none; color: inherit;
	font: italic 600 10px/1 Georgia, 'Times New Roman', serif; letter-spacing: 0; text-transform: none;
	opacity: 0.7; cursor: pointer; }
.hint-i:hover, .hint-i:focus-visible { opacity: 1; }
.hint-i[aria-expanded="true"] { opacity: 1; background: currentColor; }
.hint-i[aria-expanded="true"] span { color: var(--bg, #0b0f16); }
.hint.folded { display: none; }`;
	document.head.appendChild(style);

	// the setting's name for a hint: the section's h3, or (States & Provinces) the .label before its buttons
	function headingFor(hint) {
		const h3 = hint.closest('section')?.querySelector('h3');
		if (h3) return h3;
		for (let el = hint.previousElementSibling; el; el = el.previousElementSibling) if (el.classList.contains('label')) return el;
		return null;
	}
	for (const id of IDS) {
		const hint = document.getElementById(id);
		const head = hint && headingFor(hint);
		if (!head || head.querySelector('.hint-i')) continue;
		// the name is re-translated by replacing the heading's text, so it moves to a span of its own first
		if (head.hasAttribute('data-i18n')) {
			const name = document.createElement('span');
			name.setAttribute('data-i18n', head.getAttribute('data-i18n'));
			name.textContent = head.textContent;
			head.removeAttribute('data-i18n');
			head.replaceChildren(name);
		}
		const b = document.createElement('button');
		b.type = 'button';
		b.className = 'hint-i';
		b.setAttribute('aria-expanded', 'false');
		b.setAttribute('aria-controls', id);
		b.setAttribute('aria-label', 'About ' + head.textContent.trim().toLowerCase());
		b.innerHTML = '<span aria-hidden="true">i</span>';
		b.addEventListener('click', () => {
			const open = b.getAttribute('aria-expanded') !== 'true';
			b.setAttribute('aria-expanded', String(open));
			hint.classList.toggle('folded', !open);
		});
		hint.classList.add('folded');
		head.appendChild(b);
	}
})();
