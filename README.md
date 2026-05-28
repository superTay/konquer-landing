<p align="center">
  <img src="public/logo.svg" width="230" alt="KonquerAI logo" />
</p>

<h1 align="center">KonquerAI — Marketing Landing</h1>

<p align="center">
  <strong>Public, pre-login marketing site for KonquerAI</strong> — an invoicing &amp; tax-compliance SaaS<br/>
  for Spanish trade freelancers (painters, electricians, plumbers, builders…).
</p>

<p align="center">
  Built with <b>Astro</b> + <b>Tailwind v4</b> · zero-runtime-JS by default · premium motion, CSS-only.
</p>

<p align="center">
  <a href="https://konquerai.com"><b>🌐 Live&nbsp;site</b></a> &nbsp;·&nbsp;
  <a href="https://app.konquerai.com">App</a> &nbsp;·&nbsp;
  <a href="https://christian-marzal-portfolio.vercel.app">Author&nbsp;portfolio</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Astro-6-BC52EE?logo=astro&logoColor=white" alt="Astro 6" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Lighthouse-95%2B-00D1B2" alt="Lighthouse 95+" />
</p>

<p align="center">
  <a href="https://konquerai.com">
    <img src="docs/preview-home.png" width="780" alt="KonquerAI landing — hero with liquid-glass navbar and product mockup" />
  </a>
</p>

<p align="center"><sub><a href="https://konquerai.com">konquerai.com</a> — live</sub></p>

---

## ✨ What this is

This repository is the **public marketing landing** served at [**konquerai.com**](https://konquerai.com) — the front door that turns organic, ad and word-of-mouth traffic into qualified leads.

It is **one piece of the KonquerAI ecosystem**, a complete invoicing & tax-compliance product for Spanish trade freelancers, **designed and built solo, end-to-end** (web + mobile + AI backend), and running in production with real beta users.

> The product helps a 55-year-old painter run his business seriously *without fighting technology*: budgets and invoices by voice, supplier invoices that file themselves, real per-job profitability, and Spanish tax compliance (VeriFactu / IVA / IRPF) handled automatically.

## 🧩 The KonquerAI ecosystem

| Layer | Stack | Highlights |
| :--- | :--- | :--- |
| **Web SaaS** | React 19 · TypeScript · Supabase · n8n | Multi-tenant, VeriFactu / IVA / IRPF compliance, atomic invoice numbering in PL/pgSQL, RLS hardening, applied AI |
| **Mobile app** | Flutter | Camera invoice scanner, voice assistant, offline cache — *approved on TestFlight* |
| **Backend / automation** | n8n · LangChain · Gemini · OpenAI | 17 production workflows: dual-AI OCR (Gemini → OpenAI), conversational agent, email → invoice ingestion, VeriFactu hash chain |
| **Landing** *(this repo)* | Astro · Tailwind v4 · TypeScript | Static, performance-first marketing site at konquerai.com |

## 🏗️ Engineering highlights (this repo)

- **Zero-runtime-JS by default** — pure static Astro. The whole site ships **~25 lines of hand-written vanilla JS** (animated counters + navbar scroll-state). No React/Vue runtime, no animation library.
- **Performance-first** — self-hosted fonts (no render-blocking), `astro:assets` responsive images (auto WebP/AVIF), eager hero + lazy below-the-fold. Targets **95+ Lighthouse** and clean Core Web Vitals.
- **Premium motion, CSS-only** — liquid-glass floating navbar that condenses on scroll, choreographed hero entrance, scroll-driven reveals & image parallax via native `animation-timeline`, hover glow + cursor spotlight, dark contrast bands with count-up stats.
- **Accessible by default** — every animation respects `prefers-reduced-motion`; semantic HTML, 44px touch targets, visible focus states, WCAG-AA contrast.
- **SEO ready** — auto-generated sitemap, JSON-LD `SoftwareApplication` schema, OpenGraph / Twitter cards, canonical URLs.
- **Design system** — Tailwind v4 `@theme` tokens (brand teal `#00D1B2` / orange `#FF8A00`, type scale, shadows) applied consistently across every section.

## 🛠️ Tech stack

`Astro 6` · `Tailwind CSS v4` · `TypeScript (strict)` · `@fontsource` (self-hosted Outfit + Plus Jakarta Sans) · `@astrojs/sitemap` · deployed on `Vercel` (auto-deploy on push to `main`).

## 📁 Project structure

```text
konquer-landing/
├── public/             # Static assets — logo, favicons, og-image, robots.txt
├── src/
│   ├── assets/         # Optimized images & product screenshots (astro:assets)
│   ├── components/     # Section components — Hero, Pilares, Cifras, Pricing, CtaFinal…
│   ├── layouts/        # Base.astro — shared shell, <head>, SEO, global scripts
│   ├── pages/          # index.astro + legal/* (privacy, terms, cookies, GDPR)
│   └── styles/         # global.css — Tailwind v4 @theme tokens + design system
├── astro.config.mjs
├── vercel.json         # Framework preset + security headers
└── package.json
```

## 🧞 Commands

Run from the project root:

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Install dependencies                         |
| `npm run dev`     | Start the local dev server at `localhost:4321` |
| `npm run build`   | Build the production site to `./dist/`       |
| `npm run preview` | Preview the production build locally         |

### Environment variables

| Variable | Purpose |
| :--- | :--- |
| `PUBLIC_WEB3FORMS_ACCESS_KEY` | Public [Web3Forms](https://web3forms.com) key that powers the contact / demo-request form. |

Create a `.env` for local development:

```sh
PUBLIC_WEB3FORMS_ACCESS_KEY=your-web3forms-key
```

## 🚀 Deployment

Hosted on **Vercel** with **continuous deployment**: every push to `main` triggers a production build at [konquerai.com](https://konquerai.com). The build is static (`astro build` → `dist/`); security headers are defined in `vercel.json`.

## 👤 Author

**Christian Marzal della Rovere** — full-stack builder, automation & AI. Trilingual professional (🇪🇸 ES · 🇬🇧 EN · 🇫🇷 FR).

A deliberate career changer: after a decade as a concierge in international luxury hospitality (Marriott Opéra & Champs-Élysées, Paris), I retrained as a developer and built a **real** portfolio — not tutorial projects. I lived the *pre-AI → AI-native* transition from the inside: I learned the fundamentals by hand and adapted to agentic workflows in real time. The KonquerAI ecosystem — a full SaaS with web, mobile and an AI backend — was built solo.

Available for **junior full-stack / mobile / backend / automation** roles · global remote or Paris / Île-de-France.

🔗 [Portfolio](https://christian-marzal-portfolio.vercel.app) · [Live product](https://konquerai.com)
