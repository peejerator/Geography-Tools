# World Flags' flags: where they come from

One SVG per World Capitals country, named by its id in `../../capital-atlas/data/countries.json`. Built by
`tools-src/flag-atlas/build.mjs` (README there); don't edit them by hand.

- **Every flag but two**: [country-flags](https://github.com/hjnilsson/country-flags) 1.2.10 by Hampus Nilsson
  (npm `svg-country-flags`), taken from Wikipedia / Wikimedia Commons at each flag's own shape. Its README: the flags
  "are not under copyright protection since flags are effectively in public domain (there may be other restrictions
  on how the flag can be used though)."
- **Syria (`SYR.svg`, 2025) and Kyrgyzstan (`KGZ.svg`, 2023)**: the shapes of their current flags from
  [flag-icons](https://github.com/lipis/flag-icons) 7.6.0, put back on each flag's own proportions. flag-icons is
  under the MIT licence:

```
The MIT License (MIT)

Copyright (c) 2013 Panayiotis Lipiridis

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Other versions of some flags (state, civil, alternative, the back of Paraguay's) are in `VERSION-SOURCES.md`.
