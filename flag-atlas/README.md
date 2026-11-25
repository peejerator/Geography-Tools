# World Flags

Learn the flag of every country, and where it is on the map.

**Use it here: [samplesize1.com/tools/flag-atlas](https://samplesize1.com/tools/flag-atlas/)**

**In beta.** Made by [@samplesize_1](https://www.instagram.com/samplesize_1/), on [World Capitals](../capital-atlas/)' map and code.

## What it does

- The flags of 197 countries: the 193 UN members plus Vatican City, Palestine, Kosovo and Taiwan, each at its real shape (Switzerland and the Vatican square, Nepal's two pennants, Qatar's long 11:28)
- A 3D globe or a flat map, and you can switch at any time, even mid-test
- The whole world, one region (Europe, Asia, North America, South America, Africa or Oceania), or a subregion such as West Africa or Southeast Asia, or several at once (Combine regions, or Ctrl/Cmd-click)
- **Study**, **Practice** (misses come back until you get them right) and **Test** (every country once, timed, with your best score saved)
- Two kinds of question: you get a flag and click its country, or you get a flag and type the country's name. The map never gives the answer away: the country shows only once you've answered
- Flags with more than one official version (state and civil flags, optional and alternative versions, Bolivia's Wiphala, the back of Paraguay's) show them all in Study and once answered; the **Either version** setting asks about any of them at random
- Look-alike flags get a short note once answered or studied: Chad and Romania, Indonesia and Monaco, Ireland and Côte d'Ivoire, Australia and New Zealand, the Slavic tricolours and more
- Easy and Hard: in Hard, clicks only flash green or red and nothing stays coloured until the end, and typed answers get one try, spelled right
- Rivers, lakes and the names of oceans and seas, off at the start; L or the Names button shows them
- English and 25 other languages (the whole page in 17, the country names in all 25)
- Voice commands to zoom ("Europe", "West Africa", "Caribbean", a country's name) in Chrome, Edge and Safari
- Progress and best scores stay in your browser: no account, nothing is sent anywhere

## Files

This tool is one folder of [Geography Tools](../README.md) and runs on World Capitals' code: its page loads [`../capital-atlas/app.js`](../capital-atlas/app.js), which reads `<html data-subject="flags">` and takes everything that differs from World Capitals (the question, which spellings count, the prompts, hints and look-alike notes) from [`../capital-atlas/subjects.js`](../capital-atlas/subjects.js). Its words and languages are World Capitals' too (`../capital-atlas/text.js` and `lang/`). To run it on your computer, see [Run them yourself](../README.md#run-them-yourself).

| File | What it is |
| --- | --- |
| `index.html` | The page: World Capitals' page with this tool's title, buttons and credits |
| `flags/<id>.svg` | One flag per country, named by the country's id in [`../capital-atlas/data/countries.json`](../capital-atlas/data/countries.json) |
| `flags/<id>-<version>.svg` | Other versions of a flag, from Wikimedia Commons (`scripts/fetch-flag-versions.mjs`; sources in `flags/VERSION-SOURCES.md`) |
| `flags/LICENSES.md` | Where each flag comes from, and its licence |

## Licences and credits

- **Code**: MIT, see [LICENSE](../LICENSE).
- **Flags**: from [country-flags](https://github.com/hjnilsson/country-flags) by Hampus Nilsson, taken from Wikimedia Commons at each flag's real shape (flags are effectively in the public domain). The two that changed since that set was made, Syria's (2025) and Kyrgyzstan's (2023), are from [flag-icons](https://github.com/lipis/flag-icons) (MIT). Details in [`flags/LICENSES.md`](flags/LICENSES.md).
- **Map**: [Natural Earth](https://www.naturalearthdata.com/) 1:10m country shapes, lakes and rivers, and 1:50m sea names, public domain. Borders are drawn as in World Capitals: see [its README](../capital-atlas/README.md#licences-and-credits).
- **Names in other languages**: sources and licences in [`../capital-atlas/lang/LICENSES.md`](../capital-atlas/lang/LICENSES.md).
- **d3-geo, d3-array and topojson-client** by Mike Bostock: ISC, see the [licenses](../licenses/) folder.

## Updates and feedback

This folder is copied automatically from [samplesize1.com](https://samplesize1.com/tools/) whenever the tool changes, so edits made directly here would be overwritten. Spotted an outdated flag or a bug? [Open an issue](https://github.com/SampleSize1/Geography-Tools/issues) and say which tool it's about.
