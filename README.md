# dishtoss

A responsive React and TypeScript dinner randomizer for GitHub Pages.

## Languages

dishtoss supports English, Dutch, and Danish. The selected language is saved in the browser, and the recipe idea, category labels, action buttons, copy text, and shopping list follow that language.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production build is written to `docs/` so GitHub Pages can serve it directly.

## Analytics

Analytics are optional and privacy-friendly. The app supports Plausible pageviews plus a few custom events:

- Dish Selected
- Roll Dish
- Copy Result
- Shopping List
- Save Favorite

To enable it, create a Plausible site for your domain, then build with:

```bash
VITE_PLAUSIBLE_DOMAIN=www.dishtoss.com npm run build
```

On Windows PowerShell:

```powershell
$env:VITE_PLAUSIBLE_DOMAIN="www.dishtoss.com"; npm run build
```

For the custom domain, use `www.dishtoss.com` as the domain in Plausible.

## Deploy on GitHub Pages

This repository is configured to publish from:

```text
main branch /docs folder
```

The live site is:

```text
https://www.dishtoss.com/
```
