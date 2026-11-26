# World Currencies

Learn the currency of every one of the 197 countries, with its symbol, on a 3D globe or a flat map. It runs
on World Capitals' page code (`../capital-atlas/app.js`), like World Countries and World Flags; what's
different is the `currencies` subject in `../capital-atlas/subjects.js`.

Each country is asked about by its **main currency**, the one most people pay with. Others that are also
legal tender there (Bhutan's Indian rupee, Namibia's rand) show in the note, and count as typed answers only
with Preferences → Typed answers → Any legal tender.

- **Study**: step through the countries, or click one, to see what it pays with ("Japan: Japanese Yen (¥)").
- **Click the country** and **Type the country**: you get a currency and click or type a country that uses it.
  A currency named after its own country is shown by its word alone ("Kina", "Dollar ($)"), as the full name
  would give the answer away, and any country with its own currency of that word counts. One the country
  shares and doesn't issue (Nauru's Australian dollar, Micronesia's US dollar, the euro, the CFA francs) is
  shown in full, and you find each country that uses it.
- **Type the currency**: a country lights up and you type its currency: the name with or without the
  country's ("Dollar", "Australian Dollar") or the code ("AUD").
- **Pick the currency**: a country lights up and you pick its currency from four. For a country with its own
  currency the choices are words (Dollar, Peso, Pound); for one that uses another's, they're of the same kind
  (Nauru: Australian, US, New Zealand and Fijian dollars).

## Data

| File | What |
| --- | --- |
| `data/currencies.json` | Each country's main currency and any others legal tender there (ISO 4217 codes), and each currency's English name, ISO name, symbol, word without the country (`short`) and the country it's the own currency of (`issuer`) |

Built by `node scripts/build-currencies.mjs`, which downloads two sources and uses the currencies both list as
current: ISO 4217 List One from SIX (the maintenance agency for ISO 4217; fund codes and units of account
left out) and the Unicode CLDR's currency data. The main currency is CLDR's first, except Panama (the US
dollar: the balboa is only coins) and Lesotho (the loti); the script prints its reason for
each, and every country where the two sources differ. English names and symbols are CLDR's, through Node's
`Intl`; in other languages the page uses the browser's `Intl.DisplayNames` (also CLDR). Kosovo and Palestine
aren't in the ISO list with a currency; the script gives them the euro, and the Israeli shekel and
Jordanian dinar.

Checked in November 2026 against two more sources, `world-countries` (mledoze/countries) and Wikipedia's
List of circulating currencies: all four agree on 182 of the 197 countries' currencies, and the main
currency of every other country matches at least CLDR or Wikipedia, apart from the two set by hand.
