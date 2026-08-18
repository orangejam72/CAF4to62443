# What needs checking before this is trusted

This file exists so that nothing uncertain is buried. It should shrink to nothing as items
are resolved, and it should be updated in the same commit that resolves them.

---

## 1. Objective D is incomplete — blocking

**NCSC states CAF 4.0 has 41 contributing outcomes. This repository has 40.**

Objectives A, B and C were transcribed cleanly from the NCSC PDF and cross-checked:

| Objective | Outcomes | Confidence |
|---|---|---|
| A | 9 | High — transcribed and re-verified |
| B | 20 | High — transcribed and re-verified |
| C | 6 | High — C1.a–C1.e, C2.a |
| **D** | **5** | **Low — see below** |

Objective D could not be read reliably. Repeated automated extractions of the PDF's tail
returned inconsistent results — one pass gave `D1.a, D1.b, D2.a`, another gave only
`D1.a, D2.a`, and the table of contents extraction truncated before Objective C finished.

**Currently recorded for D:**

| ID | Title | Status |
|---|---|---|
| D1.a | Response and Recovery Planning | Verified |
| D1.b | Response and Recovery Implementation | Verified |
| D1.c | Testing and Exercising | **Provisional** — carried forward from CAF 3.x |
| D2.a | Lessons Learned | Verified |
| D2.b | Using Incidents to Drive Improvements | **Provisional** — carried forward from CAF 3.x |

**Action:** open the NCSC CAF 4.0 PDF at the Objective D section (around p.63) and confirm
the exact outcome codes and titles. Then:

1. Correct `client/src/data/caf40.ts` — set `verified: true`, fix titles, add any missing outcome
2. Add or correct the corresponding entry in `client/src/data/mappings.ts`
3. Run `npm run validate:data`
4. Delete this section

Until then the app badges D1.c and D2.b as **Unverified** in the UI, and
`GapAnalysisResult.unverifiedOutcomeIds` surfaces them in every assessment.

---

## 2. Every mapping is unreviewed

All 40 mappings carry `provenance: "drafted"`. They were drafted by Claude from the two
frameworks and have had **no expert review**.

This is not a disclaimer for its own sake. CAF is outcome-based and 62443 is prescriptive,
so most links are a matter of professional judgement. A reviewer with FPSO and HVDC
experience will disagree with some of these, and should.

**Worth reviewing first — the ones most likely to be contested:**

| Outcome | Why it's contestable |
|---|---|
| `B2.c` Privileged User Management | 62443 has no dedicated PAM requirement; assembled from SR 1.3, 2.1, 1.5, 2.12. Assembly is a judgement call. |
| `B4.d` Vulnerability Management | Routed through supplier obligations (4-1 DM/SUM) because asset owners often cannot patch OT directly. Debatable framing. |
| `B3.a` Understanding Data | Mapped weakly to zone partitioning. Arguably should be "no mapping" instead. |
| `C1.c` / `C1.e` | Mapped as partial. Arguably no real 62443 counterpart exists. |
| `D1.c` / `D2.b` | Provisional outcomes *and* weak mappings — doubly uncertain. |

**Action:** review, correct, and set `provenance: "reviewed"` per mapping as you go.

---

## 3. Not yet seeded from the 47 FPSO controls

The plan was to seed the corpus from the existing 47-control CAF set built for Eramba
import, and extend from there. That file was not available when the corpus was drafted, so
it was written from the frameworks directly.

**Action:** when the control set is available, reconcile it against `mappings.ts`. Where a
mapping derives from it, set `provenance: "seeded"`. Check in particular that the CSV export
column layout still matches what the Eramba import expects.

---

## 4. Minor

- **Bundle size** — the main chunk is ~1.3 MB (398 kB gzipped), over Vite's 500 kB warning.
  Fine for an internal tool; worth code-splitting the PDF export path (`jspdf` +
  `html2canvas` are most of it) if load time matters.
- **`components.json`** — shadcn config retained so `npx shadcn add` keeps working. Harmless.
- **Unused UI components** — the full shadcn set is still in `client/src/components/ui/`.
  Tree-shaken out of the build; kept so components can be added without re-installing.
