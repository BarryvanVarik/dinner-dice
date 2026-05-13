# Dinner Dice

A responsive React and TypeScript dinner randomizer for GitHub Pages.

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
VITE_PLAUSIBLE_DOMAIN=www.dinnerdice.com npm run build
```

On Windows PowerShell:

```powershell
$env:VITE_PLAUSIBLE_DOMAIN="www.dinnerdice.com"; npm run build
```

For the current GitHub Pages URL, use `barryvanvarik.github.io` as the domain in Plausible. If you later move to `www.dinnerdice.com`, update the value and rebuild.

## Deploy on GitHub Pages

This repository is configured to publish from:

```text
main branch /docs folder
```

The live site is:

```text
https://barryvanvarik.github.io/dinner-dice/
```
