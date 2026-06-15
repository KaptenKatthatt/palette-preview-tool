# Palette Preview Lab

Palette Preview Lab is a small internal design tool for comparing color palettes in realistic portfolio UI contexts.

It was built for exploring the visual direction of Jonas Olson's portfolio: a light, editorial, subtly orbital interface using Literata, Inter, and IBM Plex Mono.

The goal is simple: make it easier to answer whether a palette feels right when it is actually used in a portfolio, not only shown as abstract swatches.

## Features

- Compare multiple palettes side by side
- View colors as named roles with hex or rgba values
- Preview each palette in portfolio-like UI sections
- Switch between Hero, Projects, Editorial, and Dark preview modes
- Paste one or more AI-generated palettes as JSON
- Validate required color roles on import
- Export the selected palette as CSS variables
- Copy palette JSON
- Generate a shareable URL hash for a selected palette
- Check basic contrast pairs such as ink on paper and solar on deep space

## Tech Stack

- React
- TypeScript
- Vite
- Plain CSS
- Fontsource packages for Literata, Inter, and IBM Plex Mono
- Lucide React icons

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Serve the latest production build locally:

```bash
npm run serve:dist
```

Type-check the project:

```bash
npm run check
```

## Palette JSON Format

The app accepts a single palette object, an array of palette objects, or an object with a `palettes` array.

```json
{
  "name": "Editorial Orbit",
  "description": "Warm editorial palette for Jonas portfolio",
  "colors": {
    "paper": "#F4EFE6",
    "paperSoft": "#FBF7EF",
    "paperWarm": "#EFE3D2",
    "ink": "#071827",
    "inkSoft": "#243444",
    "inkMuted": "#5E6873",
    "line": "rgba(7, 24, 39, 0.14)",
    "lineStrong": "rgba(7, 24, 39, 0.24)",
    "solar": "#C87918",
    "solarBright": "#F2A23A",
    "copper": "#9D5B1C",
    "deepSpace": "#07111C",
    "spaceBlue": "#102033"
  }
}
```

## Color Roles

The current palette model uses these roles:

- `paper`: page background
- `paperSoft`: cards and panels
- `paperWarm`: warm supporting surfaces
- `ink`: primary text
- `inkSoft`: secondary headings
- `inkMuted`: metadata and captions
- `line`: subtle borders
- `lineStrong`: stronger rules and dividers
- `solar`: primary accent
- `solarBright`: hover and glow accent
- `copper`: secondary accent
- `deepSpace`: dark contrast sections
- `spaceBlue`: dark cards

## Project Scripts

- `npm run dev`: start Vite for local development
- `npm run build`: type-check and create a production build
- `npm run preview`: preview the Vite production build
- `npm run serve:dist`: serve the built `dist` folder with a small Node server
- `npm run check`: run TypeScript type-checking

## QA

The repository includes a Playwright QA script at `scripts/qa-playwright.cjs`. It serves the production build, exercises the main UI controls, verifies import/export behavior, checks for console errors, and captures desktop/mobile screenshots into `output/playwright/`.

`output/` is ignored by Git because those screenshots are generated artifacts.

## Version 1 Scope

This version focuses on fast visual decision-making:

- hardcoded starter palettes
- side-by-side comparison
- realistic mini UI previews
- AI-friendly JSON import
- CSS variable export
- simple contrast feedback

Future improvements could include localStorage persistence, richer contrast checks, portfolio token export, and more preview templates.
