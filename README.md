# CAF4to62443

Maps **NCSC Cyber Assessment Framework (CAF) 4.0** contributing outcomes to
**IEC/ISA 62443** requirements, for OT and ICS compliance work.

Successor to [`CAFto62443`](https://github.com/orangejam72/CAFto62443) — a Manus-generated
prototype. This version removes the Manus platform coupling, deletes the backend, expands
the mapping corpus from 19 outcomes to full CAF 4.0 coverage against specific SR/CR
identifiers, and deploys as a static site on Vercel.

---

## What it does

CAF is **outcome-based**: it says what good looks like, not what to build. 62443 is
**prescriptive**: zones, conduits, foundational requirements, security levels. Practitioners
re-derive the bridge between them on every project, inconsistently and unauditably.

This is that bridge, written down once, with the reasoning attached.

- **Mapping reference** — every CAF 4.0 outcome, its mapped 62443 requirements, and *why*
- **Dashboard** — compliance metrics and charts across your inventory
- **Inventory** — track OT/ICS systems by device type and criticality
- **Gap analysis** — score inventory against the framework, identify and prioritise gaps
- **Export** — CSV (Eramba-shaped) and PDF reports

## Architecture

```
Vite + React 19 + TypeScript + Tailwind 4
        │
        ├── client/src/data/     ← the mapping corpus (the product's substance)
        ├── client/src/lib/      ← local storage, gap analysis, exports
        └── static build → Vercel
```

**No backend. No database. No login. No API keys.** Inventory and assessments live in the
browser's local storage and can be exported/imported as JSON.

### Why no LLM at runtime

The prototype carried Manus scaffolding that could call an external model API
(`forge.manus.im`, `gemini-2.5-flash`). It was **dead code** — nothing ever invoked it.

Rather than wire it to Claude, the reasoning moved to **authoring time**: Claude generated
the CAF→62443 mapping corpus once, offline, and the result ships as static, version-controlled
data. (It is not yet expert-reviewed — see the provenance warning below.)

That buys four things that matter for a compliance tool:

| | |
|---|---|
| **Deterministic** | The same question always returns the same mapping. A tool that answers differently on Tuesday is not evidence. |
| **Auditable** | Every mapping carries its rationale. A reviewer sees the reasoning, not a black box. |
| **Reviewable** | Changing a mapping is a pull request with a diff, not a prompt tweak. |
| **Free & keyless** | No API key in production, no inference cost, no rate limits. |

## Getting started

```bash
npm install
npm run dev            # http://localhost:3000
```

| Script | Does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Type-check then production build to `dist/` |
| `npm run check` | Type-check only |
| `npm run validate:data` | Verify corpus integrity — every outcome mapped, every requirement ID real |
| `npm run preview` | Serve the production build locally |

## Getting the code into GitHub

If you received this as a zip, the git history is already initialised — one commit on
`main`. Unzip and push:

```bash
unzip CAF4to62443.zip -d CAF4to62443
cd CAF4to62443
git remote add origin https://github.com/orangejam72/CAF4to62443.git
git push -u origin main
```

If the remote already exists from a previous attempt, use
`git remote set-url origin ...` instead of `add`.

### If you'd rather skip git entirely

Deploy straight from the folder with the Vercel CLI — no GitHub round-trip:

```bash
cd CAF4to62443
npx vercel --prod
```

You still want the code in GitHub eventually so Vercel can auto-deploy on push, but this
gets a live URL immediately.

## Deploying to Vercel

Zero configuration. Import the repo at [vercel.com/new](https://vercel.com/new) — the
included `vercel.json` sets framework, build command, output directory and SPA rewrites.

- Build command: `npm run build`
- Output directory: `dist`
- **Environment variables: none**

### Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| **"No Output Directory named 'dist' found"** or the deploy fails immediately | The GitHub repo is **empty** — Vercel imported it before any code was pushed | Push the code (above), then redeploy. Vercel does not auto-retry an empty import. |
| Build fails on `tsc` | Node too old | Requires Node ≥ 20.19. Set it in Vercel → Settings → General → Node.js Version. |
| Routes 404 on refresh | SPA rewrite missing | `vercel.json` handles this. Confirm it was committed. |
| Data vanished | Storage is per-browser, per-origin | Expected — there's no server. Use the JSON export to move data between browsers. |

## The mapping corpus

Lives in `client/src/data/`:

| File | Contains |
|---|---|
| `caf40.ts` | CAF 4.0 objectives, principles, contributing outcomes |
| `iec62443.ts` | 62443 requirement catalogue — SRs, CRs, ZCRs, programme and lifecycle |
| `mappings.ts` | The mappings: CAF outcome → 62443 requirements, with strength and rationale |
| `index.ts` | Public surface + a flat projection for the UI and exporters, + validation |

Current state: **40 outcomes, 40 mappings, 94 distinct 62443 requirements referenced.**

### Mapping strength

- **full** — the requirement substantially delivers the CAF outcome
- **partial** — contributes materially but is not sufficient alone
- **supporting** — provides evidence or enabling capability

### Provenance

- **drafted** — drafted by Claude from both frameworks; **not yet expert-reviewed**
- **reviewed** — checked by a domain expert
- **seeded** — derived from the asset owner's own control set

> ⚠️ **Every mapping is currently `drafted`.** This is a starting point for expert review,
> not a finished compliance artifact. CAF is outcome-based and 62443 is prescriptive, so
> most links are professional judgement — reviewers are expected to disagree with some.
> See [UNVERIFIED.md](./UNVERIFIED.md) for what specifically needs checking, and [PRD.md](./PRD.md) for the full product definition.

### Where CAF asks for more than 62443

Worth knowing before you claim coverage. These outcomes have weak or no 62443 counterpart:

| Outcome | Gap |
|---|---|
| **C2.a Threat Hunting** | No counterpart at all. 62443 detects defined events; it does not proactively hunt. The largest gap between the frameworks. |
| **A2.b Understanding Threat** | 62443 risk assessment is threat-informed but never requires a maintained threat picture. |
| **C1.c Generating Alerts** | 62443 requires monitoring, but says nothing about enrichment, correlation or behavioural baselining. |
| **C1.e Maintaining Monitoring Effectiveness** | No requirement to review detection coverage as the estate and threat change. |
| **B3.a Understanding Data** | 62443 is system- and zone-oriented; no data inventory or classification requirement. |
| **B6.a Cyber Security Culture** | 62443-2-1 covers training, but has no equivalent to CAF's psychological safety expectation. |

## Copyright

**IEC 62443 is a paid standard and its clause text is copyrighted.** This repository
contains only requirement **identifiers**, short factual **titles**, and **our own**
plain-English summaries and rationale. It must never contain verbatim clause text.
Keep it that way when editing `iec62443.ts`.

**CAF is Crown Copyright**, published by NCSC under the Open Government Licence, and may
be used with attribution.

## Sources

- [NCSC Cyber Assessment Framework 4.0](https://www.ncsc.gov.uk/files/NCSC-Cyber-Assessment-Framework-4.0.pdf) (published 6 August 2025)
- [NCSC — CAF v4.0 released in response to growing threat](https://www.ncsc.gov.uk/blog-post/caf-v4-0-released-in-response-to-growing-threat)
- [IEC 62443 — IEC SyC Smart Energy](https://syc-se.iec.ch/deliveries/cybersecurity-guidelines/security-standards-and-best-practices/iec-62443/)

## Licence

Proprietary. All rights reserved.
