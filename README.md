# Arabic Study Hub

Static study site (no build step) for Arabic numbers, nahw, makharij al-huruf and rada'ah. Open `index.html` or serve the folder with any static host (GitHub Pages works as is).

## Pages

| File | Content |
| --- | --- |
| `index.html` | Home: topics, search, practice entry |
| `numbers.html` | قواعد الأعداد table, number finder, notes |
| `nahw.html` | Rafa / nasb / jarr markers with examples |
| `makharij-chart.html` | Interactive letter explorer and full area list |
| `radaah.html` | Relationship diagrams |
| `practice.html` | Mixed quiz and flashcards across topics |

## Editing content

All content lives in `assets/js/data.js`. Tables, search results, quiz questions and flashcards are generated from it, so edit a rule there and every page picks it up.

## Code

- `assets/js/site.js` — helpers, theme toggle, print, search (`/` or `Ctrl/⌘ K`)
- `assets/js/practice.js` — quiz and flashcard engine
- `assets/js/pages.js` — page renderers
- `assets/css/styles.css` — design tokens (light/dark), components, print styles
