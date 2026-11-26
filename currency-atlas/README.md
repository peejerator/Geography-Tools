# World Currencies

Learn the currency of every one of the 197 countries, with its symbol, on a 3D globe or a flat map. It runs
on World Capitals' page code (`../capital-atlas/app.js`), like World Countries and World Flags; what's
different is the `currencies` subject in `../capital-atlas/subjects.js`.

- **Study**: step through the countries, or click one, to see what it pays with ("Japan: Japanese Yen (¥)").
- **Click the country**: you get a currency and click a country that uses it. Where several countries share
  one (the euro, the CFA francs, the US dollar), any of them counts.
- **Type the currency**: a country lights up and you type its currency: the name with or without the
  country's ("Yen", "Japanese Yen") or the code ("JPY").
- **Type the country**: you get a currency and type a country that uses it.

## Data

| File | What |
| --- | --- |
| `data/currencies.json` | Each country's currencies (ISO 4217 codes), and each currency's English name, ISO name and symbol |

Built by `node scripts/build-currencies.mjs`, which downloads the current ISO 4217 List One from SIX (the
maintenance agency for ISO 4217), leaves out fund codes, and takes English names and symbols from the
Unicode CLDR through Node's `Intl`. In other languages the page names currencies with the browser's
`Intl.DisplayNames` (also CLDR). Kosovo and Palestine aren't in the ISO list with a currency; the script
gives them the euro, and the Israeli shekel and Jordanian dinar.
