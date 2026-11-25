# World Countries

Find every country on a 3D globe or a flat map.

**Use it here: [samplesize1.com/tools/country-atlas](https://samplesize1.com/tools/country-atlas/)**

**In beta.** Made by [@samplesize_1](https://www.instagram.com/samplesize_1/), on [World Capitals](../capital-atlas/)' map and code.

## What it does

- 197 countries: the 193 UN members plus Vatican City, Palestine, Kosovo and Taiwan
- A 3D globe or a flat map, and you can switch at any time, even mid-test
- The whole world, one region (Europe, Asia, North America, South America, Africa or Oceania), or a subregion such as West Africa or Southeast Asia, or several at once (Combine regions, or Ctrl/Cmd-click)
- **Study**, **Practice** (misses come back until you get them right) and **Test** (every country once, timed, with your best score saved)
- Two kinds of question: you get a country's name and click it, or a country lights up and you type its name
- Typed names take the common short forms (UK, USA, Ivory Coast, Czech Republic, DRC, East Timor...); an old name (Swaziland, Zaire, Persia...) gets "that's an old name" instead of a plain miss
- Easy and Hard: in Hard, clicks only flash green or red and nothing stays coloured until the end, and typed answers get one try, spelled right
- When the map frames one country it keeps plenty of the neighbours in view, since they're how you tell a country from its outline
- Rivers, lakes and the names of oceans and seas, off at the start; L or the Names button shows them
- English and 25 other languages (the whole page in 17, the country names in all 25)
- Voice commands to zoom ("Europe", "West Africa", "Caribbean", a country's name) in Chrome, Edge and Safari
- Progress and best scores stay in your browser: no account, nothing is sent anywhere

## Files

This tool is one folder of [Geography Tools](../README.md) and runs on World Capitals' code: its page loads [`../capital-atlas/app.js`](../capital-atlas/app.js), which reads `<html data-subject="countries">` and takes everything that differs from World Capitals (the question, which spellings count, the prompts and hints) from [`../capital-atlas/subjects.js`](../capital-atlas/subjects.js). Its words and languages are World Capitals' too (`../capital-atlas/text.js` and `lang/`). To run it on your computer, see [Run them yourself](../README.md#run-them-yourself).

| File | What it is |
| --- | --- |
| `index.html` | The page: World Capitals' page with this tool's title, buttons and credits |

## Licences and credits

- **Code**: MIT, see [LICENSE](../LICENSE).
- **Map**: [Natural Earth](https://www.naturalearthdata.com/) 1:10m country shapes, lakes and rivers, and 1:50m sea names, public domain. Borders are drawn as in World Capitals: see [its README](../capital-atlas/README.md#licences-and-credits).
- **Names in other languages**: sources and licences in [`../capital-atlas/lang/LICENSES.md`](../capital-atlas/lang/LICENSES.md).
- **d3-geo, d3-array and topojson-client** by Mike Bostock: ISC, see the [licenses](../licenses/) folder.

## Updates and feedback

This folder is copied automatically from [samplesize1.com](https://samplesize1.com/tools/) whenever the tool changes, so edits made directly here would be overwritten. Found a bug or have an idea? [Open an issue](https://github.com/SampleSize1/Geography-Tools/issues) and say which tool it's about.
