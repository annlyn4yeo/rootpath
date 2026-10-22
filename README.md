# Root-Path

Marketing site for [Root-Path](https://root-path.tech), a digital engineering studio for web, mobile and cloud.

Built with Next.js 15 (App Router), React 19, TypeScript and Tailwind CSS 4, with Motion and Lenis for animation and smooth scrolling.

## Getting started

Requires Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |
| `node scripts/generate-brand-assets.mjs` | Regenerate `public/og.png`, `app/apple-icon.png` and `app/favicon.ico` after changing the logo mark or social copy |

## Project structure

```
app/          Routes, layout, global styles, robots and sitemap
components/
  sections/   Page sections (hero, services, process, engagements, contact, footer)
  ui/         Reusable UI pieces (button, logo, reveal, scroll progress)
  motion/     Animation and interaction helpers (cursor, magnetic, smooth scroll)
lib/          Site config: SEO metadata, nav, contact details, motion presets, utils
public/       Static assets (social preview image)
scripts/      One-off build tooling
```

## Configuration

| Variable | Purpose | Default |
|----------|---------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL used for SEO metadata and the sitemap | `https://root-path.tech` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification token, rendered as a meta tag | unset |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Bing Webmaster Tools verification token (`msvalidate.01`) | unset |

Site title, description, keyword targets, structured data and contact details live in `lib/seo.ts` and `lib/contact.ts`. `/llms.txt` (a plain-text summary for AI assistants) is generated from the section data in `app/llms.txt/route.ts`.

## Deployment

Pushes to `main` build and deploy the site to GitHub Pages via `.github/workflows/nextjs.yml`.

## Contributing

Branch off `main` and open a pull request. See [BRANCHING.md](BRANCHING.md) for the branching and merge strategy.
