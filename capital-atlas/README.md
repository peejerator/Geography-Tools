# World Capitals

Learn the capital of every country on a 3D globe or a flat map.

**Use it here: [samplesize1.com/tools/capital-atlas](https://samplesize1.com/tools/capital-atlas/)**

Made by [@samplesize_1](https://www.instagram.com/samplesize_1/) to learn every capital for an n=1 experiment.

## What it does

- 197 countries: the 193 UN members plus Vatican City, Palestine, Kosovo and Taiwan
- A 3D globe or a flat map, and you can switch at any time, even mid-test
- The whole world, one region (Europe, Asia, North America, South America, Africa or Oceania), or a subregion such as West Africa or Southeast Asia, or several at once (Combine regions, or Ctrl/Cmd-click)
- **Study**, **Practice** (misses come back until you get them right) and **Test** (every country once, timed, with your best score saved)
- Two kinds of question: click the country for a capital, or type the capital of a highlighted country
- Easy and Hard: in Hard, clicks only flash green or red and nothing stays coloured until the end, and typed answers get one try with the exact spelling
- No separate insets: zoom into the Caribbean or the Pacific like anywhere else; tiny countries get a ring so they're easy to click
- Major rivers and lakes, labelled as you zoom in (the Nile, the Danube, Lake Victoria...), to help place capitals; clicking a lake names it instead of counting as the country around it
- Names of the oceans and seas too; switch all the water names off and on with L or the Names button
- Voice commands to zoom ("Europe", "West Africa", "Caribbean", a country's name) in Chrome, Edge and Safari
- Progress and best scores stay in your browser: no account, nothing is sent anywhere

## Files

This tool is one folder of [Geography Tools](../README.md). [World Countries](../country-atlas/) and [World Flags](../flag-atlas/) run on this folder's code with another subject, and [States & Provinces](../state-atlas/) uses its map files. To run it on your computer, see [Run them yourself](../README.md#run-them-yourself).

| File | What it is |
| --- | --- |
| `index.html` | The page: markup and styles |
| `app.js` | The app: drawing, questions, scoring, voice; World Countries and World Flags run it too |
| `subjects.js` | What each of the three tools asks about a country, and which typed answers count |
| `text.js` | Every word the three tools show, in English |
| `lang/<code>.json` | The names (and, in 17 of them, every word) in 25 other languages; sources and licences in `lang/LICENSES.md` |
| `geo.js` | [d3-geo](https://github.com/d3/d3-geo) and [topojson-client](https://github.com/topojson/topojson-client), bundled into one file |
| `data/countries.json` | Each country's capital, region and capital coordinates (capitals checked October 2026) |
| `data/map-*.json` | Country shapes at four levels of detail, from coarse (`xlow`) to every island (`high`) |
| `data/water-*.json` | Lakes and rivers with their names, at two levels of detail |
| `data/seas.json` | Names of oceans and seas, and where to put them |
| [`../scripts/build-capital-atlas-map.mjs`](../scripts/build-capital-atlas-map.mjs) | Rebuilds the map files from Natural Earth (instructions at the top of the file) |
| [`../scripts/build-capital-atlas-water.mjs`](../scripts/build-capital-atlas-water.mjs) | Rebuilds the lakes and rivers from Natural Earth (instructions at the top of the file) |

## Licences and credits

- **Code and capitals data**: MIT, see [LICENSE](../LICENSE).
- **Map**: [Natural Earth](https://www.naturalearthdata.com/) 1:10m country shapes, lakes and rivers, and 1:50m sea names, public domain.
- **Borders** are drawn as the UN and most countries recognise them, not by who holds the ground: Crimea is part of Ukraine, the Golan Heights part of Syria, East Jerusalem part of Palestine, and Western Sahara is its own territory. Where no side is widely recognised (Kashmir, the Kuril Islands), the map follows who administers each part. The list and the reasons are at the top of [`../scripts/build-capital-atlas-map.mjs`](../scripts/build-capital-atlas-map.mjs).
- **d3-geo, d3-array and topojson-client** by Mike Bostock: ISC, see the [licenses](../licenses/) folder.

## Updates and feedback

This folder is copied automatically from [samplesize1.com](https://samplesize1.com/tools/) whenever the tool changes, so edits made directly here would be overwritten. Spotted an outdated capital or a bug? [Open an issue](https://github.com/SampleSize1/Geography-Tools/issues) and say which tool it's about.
