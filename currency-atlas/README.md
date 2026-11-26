# World Currencies

Learn the currency of every one of the 197 countries, with its symbol, on a 3D globe or a flat map. It runs
on World Capitals' page code (`../capital-atlas/app.js`), like World Countries and World Flags; what's
different is the `currencies` subject in `../capital-atlas/subjects.js`.

Each country is asked about by its **main currency**, the one most people pay with. Others that are also
legal tender there (Bhutan's Indian rupee, Namibia's rand) show in the note, and count as typed answers only
with Preferences → Typed answers → Any legal tender.

- **Study**: step through the countries, or click one, to see what it pays with ("Japan: Japanese Yen (¥)").
- **Click the country**: you get a currency and click a country where it's the main one. Where several
  countries share it (the euro, the CFA francs, the US dollar), any of them counts.
- **Type the currency**: a country lights up and you type its currency: the name with or without the
  country's ("Yen", "Japanese Yen") or the code ("JPY").
- **Type the country**: you get a currency and type a country where it's the main one.

## Data

| File | What |
| --- | --- |
| `data/currencies.json` | Each country's main currency and any others legal tender there (ISO 4217 codes), and each currency's English name, ISO name and symbol |

Built by `node scripts/build-currencies.mjs`, which downloads two sources and uses the currencies both list as
current: ISO 4217 List One from SIX (the maintenance agency for ISO 4217; fund codes and units of account
left out) and the Unicode CLDR's currency data. The main currency is CLDR's first, except Panama and
Zimbabwe (the US dollar, which most payments use) and Lesotho (the loti); the script prints its reason for
each, and every country where the two sources differ. English names and symbols are CLDR's, through Node's
`Intl`; in other languages the page uses the browser's `Intl.DisplayNames` (also CLDR). Kosovo and Palestine
aren't in the ISO list with a currency; the script gives them the euro, and the Israeli shekel and
Jordanian dinar.

Checked in November 2026 against two more sources, `world-countries` (mledoze/countries) and Wikipedia's
List of circulating currencies: all four agree on 182 of the 197 countries' currencies, and the main
currency of every other country matches at least CLDR or Wikipedia, apart from the three set by hand.
