# CAF4to62443 — Product Requirements Document

**Status:** v1.0 — **built and verified**
**Owner:** Jaime Bourne (`orangejam72`)
**Date:** 18 August 2026
**Supersedes:** `CAFto62443` (Manus-generated prototype)
**Repository:** https://github.com/orangejam72/CAF4to62443

> **Change from v0.1.** The v0.1 draft was written before the prototype source was
> readable. Every `[VERIFY]` marker has now been resolved against the actual code, and two
> decisions changed as a result — see §4 and §5. This document now describes what was
> built, not what was proposed.

---

## 1. Summary

CAF4to62443 maps **NCSC Cyber Assessment Framework (CAF) v4.0** contributing outcomes onto
**IEC/ISA 62443** requirements, so an operator assessed against CAF can see what that means
in OT/ICS engineering terms — and vice versa.

Three goals, in priority order, all met:

| Goal | Status |
|---|---|
| Remove the runtime LLM dependency | ✅ Done — the dependency turned out to be dead code (§4) |
| Run on Vercel | ✅ Done — static build, zero config, no env vars |
| Be maintainable | ✅ Done — typed corpus, validation script, reviewable in PRs |

---

## 2. Problem

CAF is deliberately **outcome-based** — it says *what good looks like*, not *what to build*.
Objective B4 ("System Security") asks that systems be protected from cyber attack; it does
not tell an FPSO controls engineer which segmentation model to implement.

IEC 62443 is the opposite: prescriptive, engineering-level, expressed in zones, conduits,
foundational requirements and security levels. It says *what to build*, but says nothing
about UK regulatory expectations.

Practitioners hold both in their heads and re-derive the bridge on every project.
Inconsistently, and unauditably.

**The product is that bridge, written down once, traceable, and queryable.**

### Users

| User | Need |
|---|---|
| OT security lead at a UK OES | Given a CAF outcome we scored poorly on, what 62443 requirements close the gap? |
| Controls/automation engineer | Given a 62443 requirement I'm implementing, which CAF outcome does it evidence? |
| GRC / compliance analyst | Export the mapping as evidence into Eramba |
| Assessor / auditor | See the rationale behind each mapping, not just a tick |

---

## 3. Scope

### Delivered in v1

- Full **CAF v4.0** structure — 4 objectives → 14 principles → 40 contributing outcomes
- **IEC 62443** catalogue — 94 distinct requirement identifiers referenced across
  62443-2-1, 2-4, 3-2, 3-3, 4-1 and 4-2
- Every mapping carries **rationale**, **strength** (full / partial / supporting) and
  **provenance**
- Browse and filter by objective, principle and device type; full-text search
- Compliance dashboard with charts
- System inventory (embedded / network / host, criticality)
- Gap analysis engine
- Export: CSV (Eramba-shaped) and PDF reports

### Deliberately out of scope

- **User accounts and multi-user data.** This is a reference and analysis tool, not a system
  of record. Jaime has separate NIST CSF / Privacy Framework assessment tools; not duplicated.
- **Reproducing copyrighted IEC/ISA text.** See §7.
- **Runtime LLM chat.** See §4.

---

## 4. The LLM decision — resolved

The v0.1 draft assumed the prototype called an LLM at runtime and that the work would be
rewiring it to Claude.

**That assumption was wrong.** Reading the source showed:

- `server/_core/llm.ts` defined `invokeLLM()`, pointing at `https://forge.manus.im/v1/chat/completions`, model `gemini-2.5-flash`, keyed on `OPENAI_API_KEY`
- **Nothing ever called it.** No `ai.chat` route existed
- `AIChatBox.tsx` referenced it only inside a comment; the component was unused scaffolding

So removing the API references was **deletion, not rewiring** — and the `OPENAI_API_KEY` in
the prototype's environment was never actually used.

### What replaced it

The requirement — *"extrapolate the LLM to create a new one so we don't need the API
references"* — was implemented as: **the reasoning moves from runtime to authoring time.**

Claude generated the CAF→62443 mapping corpus once, offline. It ships as typed, static,
version-controlled data:

```
client/src/data/
  caf40.ts      # objectives, principles, contributing outcomes
  iec62443.ts   # requirement catalogue (identifiers + our own summaries)
  mappings.ts   # CAF outcome → 62443 requirements + rationale + strength + provenance
  index.ts      # flat projection for UI/exporters + integrity validation
```

Consequences, all intended:

- **No API key in production.** Nothing to leak, rotate or rate-limit.
- **£0 runtime inference cost.** Vercel Hobby tier is sufficient.
- **Deterministic.** The same question always returns the same mapping. Non-negotiable for a
  compliance artifact — a tool that answers differently on Tuesday is not evidence.
- **Reviewable.** A mapping change is a pull request with a diff, not a prompt tweak.
- **Auditable.** Every link carries the reasoning that produced it.

**Decision on an optional runtime "ask a question" mode: not built, and not recommended.**
It would reintroduce a key, a cost and non-determinism to solve a problem the static corpus
already solves.

---

## 5. Architecture — changed from v0.1

> **Deviation.** v0.1 specified a Next.js rebuild. **Not done, deliberately.**
>
> With auth and the database dropped (§6), there is no server left to justify Next.js. The
> existing client was already Vite + React 19 + wouter with a complete shadcn component set,
> four working pages, and jsPDF/Recharts export code. A Next.js rewrite would have meant
> re-doing all the routing to gain nothing — Vercel deploys a Vite static build natively.
>
> Result: less rewriting, more working UI preserved, same end state. Agreed with Jaime.

```
Vite 7 + React 19 + TypeScript + Tailwind 4
        │
        ├── client/src/data/   ← the mapping corpus (the product's substance)
        ├── client/src/lib/    ← local persistence, gap analysis, exports
        └── static build → dist/ → Vercel
```

- **Backend:** none
- **Database:** none — browser `localStorage`, with JSON import/export for portability
- **Auth:** none
- **State:** React + local store subscription
- **Deployment:** Vercel, zero-config via `vercel.json`, `main` → production

### Non-functional — measured

| | Target | Actual |
|---|---|---|
| Runtime secrets | Zero | **Zero** |
| Build | Clean, no type errors | ✅ `tsc --noEmit` + `vite build` pass |
| Bundle | — | 1.33 MB raw / **398 kB gzipped** |
| Data integrity | Automated | ✅ `npm run validate:data` |
| Page errors | Zero | ✅ Zero across all four routes (headless) |

---

## 6. Migration from the Manus prototype — completed

| Removed | Replaced with |
|---|---|
| `vite-plugin-manus-runtime` | Standard Vite config |
| `client/public/__manus__/debug-collector.js` | Deleted |
| `ManusDialog.tsx`, `useAuth`, Manus OAuth | No auth |
| Express + tRPC backend | `lib/localApi.ts` — a tRPC-shaped shim over local storage, so pages barely changed |
| Drizzle ORM + MySQL/TiDB | `lib/localStore.ts` — `localStorage` + JSON import/export |
| `server/gapAnalysis.ts` | `lib/gapAnalysis.ts` — same logic, client-side |
| `server/_core/llm.ts` (dead) | Deleted |
| Umami analytics tag in `index.html` | Deleted |
| 19 free-text mappings | 40 structured mappings, 94 requirement IDs |

**Preserved:** all four pages, the full shadcn component set, CSV and PDF export, charts,
theming.

**Secrets:** the prototype's full 9-commit history was scanned. **Clean** — the only matches
were placeholder strings in the README (`mysql://user:password@host:port/database`,
`your_jwt_secret_key`). Nothing to rotate.

### Bug fixed in migration

The original gap analysis only ever produced `implemented` or `not_implemented`, so its
`partial` bucket was permanently zero and partial coverage across systems was invisible. The
port derives status per-outcome across all applicable systems and reports genuine partial
coverage.

---

## 7. Legal constraint — IEC/ISA copyright

IEC 62443 is a **paid standard**; its clause text is copyrighted and must not be reproduced
in a repository or public web app.

The app stores:

- ✅ Requirement **identifiers** (`SR 1.1`, `CR 2.1`, `ZCR 3`) — references, not protected text
- ✅ Short factual **titles**
- ✅ **Our own** plain-English summaries and rationale
- ❌ **Never** verbatim clause text

CAF is Crown Copyright, published free by NCSC under the Open Government Licence — usable
with attribution. Both constraints are stated in the README and in `iec62443.ts`.

---

## 8. Verified reference data

Confirmed against the NCSC CAF 4.0 PDF (published **6 August 2025**).

**Objectives:** A — Managing security risk · B — Protecting against cyber attack ·
C — Detecting cyber security events · D — Minimising the impact of cyber security incidents

| Principle | Contributing outcomes |
|---|---|
| **A1** Governance | A1.a Board Direction · A1.b Roles and Responsibilities · A1.c Decision-making |
| **A2** Risk Management | A2.a Risk Management Process · **A2.b Understanding Threat** · A2.c Assurance |
| **A3** Asset Management | A3.a Asset Management |
| **A4** Supply Chain | A4.a Supply Chain · **A4.b Secure Software Development and Support** |
| **B1** Service Protection Policies, Processes and Procedures | B1.a Development · B1.b Implementation |
| **B2** Identity and Access Control | B2.a Identity Verification, Authentication and Authorisation · B2.b Device Management · B2.c Privileged User Management · B2.d IdAM |
| **B3** Data Security | B3.a Understanding Data · B3.b Data in Transit · B3.c Stored Data · B3.d Mobile Data · B3.e Media / Equipment Sanitisation |
| **B4** System Security | B4.a Secure by Design · B4.b Secure Configuration · B4.c Secure Management · B4.d Vulnerability Management |
| **B5** Resilient Networks and Systems | B5.a Resilience Preparation · B5.b Design for Resilience · B5.c Backups |
| **B6** Staff Awareness and Training | B6.a Cyber Security Culture · B6.b Cyber Security Training |
| **C1** Security Monitoring | C1.a Sources and Tools · C1.b Securing Logs · C1.c Generating Alerts · C1.d Responding to Alerts · C1.e Maintaining Monitoring Effectiveness |
| **C2** Threat Hunting | **C2.a Threat Hunting** |
| **D1** Response and Recovery Planning | D1.a Planning · D1.b Implementation · D1.c Testing and Exercising ⚠️ |
| **D2** Lessons Learned | D2.a Lessons Learned · D2.b Using Incidents to Drive Improvements ⚠️ |

**New or changed in 4.0 (bold):** `A2.b Understanding Threat`, `A4.b Secure Software
Development and Support`, `C2 Threat Hunting` (new principle; was "Proactive Security Event
Discovery" in 3.x), plus expanded C1 and D1.

> ⚠️ **Objective D is unresolved — see `UNVERIFIED.md`.** NCSC states CAF 4.0 has 41
> contributing outcomes; this build has 40. A, B and C were transcribed and re-verified
> (9 / 20 / 6). Objective D could not be read reliably — repeated extractions of the PDF's
> tail disagreed. `D1.c` and `D2.b` are carried forward from CAF 3.x, flagged
> `verified: false`, badged **Unverified** in the UI, and surfaced in every gap analysis
> result. **Resolve against the source PDF (~p.63) before this is treated as complete.**

### Where CAF asks for more than 62443 can evidence

| Outcome | Gap |
|---|---|
| **C2.a Threat Hunting** | No 62443 counterpart at all. The largest gap between the frameworks. |
| **A2.b Understanding Threat** | 62443 risk assessment is threat-informed but never requires a maintained threat picture. |
| **C1.c Generating Alerts** | 62443 requires monitoring; says nothing about enrichment, correlation or baselining. |
| **C1.e Maintaining Monitoring Effectiveness** | No requirement to review detection coverage over time. |
| **B3.a Understanding Data** | 62443 is system- and zone-oriented; no data inventory or classification requirement. |
| **B6.a Cyber Security Culture** | 62443-2-1 covers training but has no equivalent to psychological safety. |

Flag these in assessments rather than claiming coverage.

---

## 9. Success criteria

| # | Criterion | Status |
|---|---|---|
| 1 | `npm run build` clean; deploys to Vercel with no configuration | ✅ |
| 2 | No API key required to run the deployed app | ✅ |
| 3 | Every CAF outcome has a mapping or an explicit reasoned gap | ✅ 40/40 |
| 4 | Every mapping carries a rationale a domain expert would accept | ⚠️ Drafted; **awaiting expert review** |
| 5 | CSV export loads into Eramba without reshaping | ⚠️ **Unconfirmed** — needs testing against a real import |
| 6 | No verbatim IEC/ISA text in the repository | ✅ |
| 7 | No secrets in the repository or its history | ✅ Scanned, clean |

---

## 10. Open items

1. **Objective D** — confirm against the NCSC PDF and close the 40-vs-41 discrepancy. *Blocking.*
2. **Expert review of all 40 mappings** — every one is `provenance: "drafted"`. Most
   contestable: `B2.c`, `B4.d`, `B3.a`, `C1.c`, `C1.e`, `D1.c`, `D2.b`.
3. **The 47 FPSO controls** — the agreed seed source, not yet supplied. When available,
   reconcile, mark `provenance: "seeded"`, and confirm the CSV layout still matches Eramba.
4. **Eramba import test** — success criterion 5 is unverified.
5. **Audience** — internal Aker/Kværner tool or public reference site? Changes the copyright
   posture and hosting model. Currently deployed as a private repo → Vercel.
6. **Bundle splitting** — 398 kB gzipped, dominated by `jspdf` + `html2canvas`. Fine for an
   internal tool; split the PDF path if load time starts to matter.

---

## Sources

- [Cyber Assessment Framework 4.0 (NCSC PDF)](https://www.ncsc.gov.uk/files/NCSC-Cyber-Assessment-Framework-4.0.pdf)
- [CAF v4.0 released in response to growing threat — NCSC](https://www.ncsc.gov.uk/blog-post/caf-v4-0-released-in-response-to-growing-threat)
- [CAF 4.0: What's changed? — e2e-assure](https://e2e-assure.com/cyber-fundamentals/caf-4-whats-changed)
- [Objectives, principles and contributing outcomes — security.gov.uk](https://www.security.gov.uk/policy-and-guidance/cyber-assessment-framework-caf-for-local-government/understand-the-cyber-assessment-framework/objectives-principles-and-contributing-outcomes)
- [IEC 62443 — IEC SyC Smart Energy](https://syc-se.iec.ch/deliveries/cybersecurity-guidelines/security-standards-and-best-practices/iec-62443/)
- [ISA/IEC 62443-3-3 overview — Cisco](https://www.cisco.com/c/en/us/products/collateral/security/isaiec-62443-3-3-wp.html)
