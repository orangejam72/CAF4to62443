/**
 * Public data surface.
 *
 * The structured corpus (caf40.ts / iec62443.ts / mappings.ts) is the source of
 * truth. This module also derives a flat "legacy" projection matching the shape
 * the original prototype's mappings.json used, so the existing Home, CSV export
 * and PDF export code keeps working unchanged while the richer structure is
 * adopted incrementally.
 */

import { outcomes, principleById, objectiveById, type CafOutcome } from "./caf40";
import { requirementById } from "./iec62443";
import { mappings, mappingByCafId, type Mapping, type Strength } from "./mappings";

export * from "./caf40";
export * from "./iec62443";
export * from "./mappings";

/** Flat record shape consumed by the existing UI, CSV and PDF exporters. */
export interface FlatMapping {
  id: string;
  objective: string;
  objectiveName: string;
  principle: string;
  principleName: string;
  itemName: string;
  description: string;
  cafDescription: string;
  isa62443_3_3: string;
  isa62443_4_2: string;
  deviceTypes: string[];
  keywords: string[];
  /** Extras beyond the original shape — safe to ignore in legacy consumers. */
  rationale: string;
  verified: boolean;
  newIn40: boolean;
  provenance: string;
}

const STRENGTH_MARK: Record<Strength, string> = {
  full: "",
  partial: " (partial)",
  supporting: " (supporting)",
};

function renderLinks(mapping: Mapping | undefined, predicate: (part: string) => boolean): string {
  if (!mapping) return "No mapping recorded";
  const parts = mapping.links
    .map((l) => ({ link: l, req: requirementById[l.id] }))
    .filter((x) => x.req && predicate(x.req.part))
    .map((x) => `${x.link.id} ${x.req!.title}${STRENGTH_MARK[x.link.strength]}`);
  return parts.length > 0 ? parts.join("; ") : "—";
}

/** 3-3 column also carries the programme-level parts (2-1, 2-4, 3-2, 4-1). */
const isSystemSide = (part: string) => part !== "62443-4-2";
const isComponentSide = (part: string) => part === "62443-4-2";

function toFlat(outcome: CafOutcome): FlatMapping {
  const mapping = mappingByCafId[outcome.id];
  const principle = principleById[outcome.principle];
  const objective = objectiveById[outcome.objective];

  return {
    id: outcome.id,
    objective: outcome.objective,
    objectiveName: objective?.name ?? "",
    principle: outcome.principle,
    principleName: principle?.name ?? "",
    itemName: outcome.name,
    description: outcome.summary,
    cafDescription: principle?.name ?? "",
    isa62443_3_3: renderLinks(mapping, isSystemSide),
    isa62443_4_2: renderLinks(mapping, isComponentSide),
    deviceTypes: (mapping?.deviceTypes ?? ["All"]).map((d) =>
      d === "All" ? "All" : d.charAt(0).toUpperCase() + d.slice(1)
    ),
    keywords: mapping?.keywords ?? [],
    rationale: mapping?.rationale ?? "",
    verified: outcome.verified,
    newIn40: Boolean(outcome.newIn40),
    provenance: mapping?.provenance ?? "drafted",
  };
}

/** Every CAF 4.0 outcome, in framework order, with its mapping flattened. */
export const flatMappings: FlatMapping[] = outcomes.map(toFlat);

/** Legacy alias — the original code imported `{ mappings }` from mappings.json. */
export const legacyMappings = flatMappings;

/* ------------------------------------------------------------------ */
/* Integrity checks — run by `npm run validate:data`                   */
/* ------------------------------------------------------------------ */

export interface ValidationIssue {
  severity: "error" | "warning";
  message: string;
}

export function validateData(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Every outcome must have a mapping.
  for (const o of outcomes) {
    if (!mappingByCafId[o.id]) {
      issues.push({ severity: "error", message: `CAF outcome ${o.id} has no mapping entry` });
    }
  }

  // Every mapping must point at a real outcome and real requirements.
  for (const m of mappings) {
    if (!outcomes.some((o) => o.id === m.cafId)) {
      issues.push({
        severity: "error",
        message: `Mapping references unknown CAF outcome "${m.cafId}"`,
      });
    }
    if (m.links.length === 0) {
      issues.push({ severity: "warning", message: `Mapping ${m.cafId} has no requirement links` });
    }
    for (const link of m.links) {
      if (!requirementById[link.id]) {
        issues.push({
          severity: "error",
          message: `Mapping ${m.cafId} references unknown requirement "${link.id}"`,
        });
      }
    }
    if (!m.rationale || m.rationale.length < 20) {
      issues.push({ severity: "warning", message: `Mapping ${m.cafId} has a thin rationale` });
    }
  }

  // Duplicate ids.
  const seen = new Set<string>();
  for (const o of outcomes) {
    if (seen.has(o.id)) {
      issues.push({ severity: "error", message: `Duplicate CAF outcome id "${o.id}"` });
    }
    seen.add(o.id);
  }

  // Unverified content should be visible, not silent.
  const unverified = outcomes.filter((o) => !o.verified);
  if (unverified.length > 0) {
    issues.push({
      severity: "warning",
      message: `${unverified.length} outcome(s) unverified against the NCSC source: ${unverified
        .map((o) => o.id)
        .join(", ")}`,
    });
  }

  return issues;
}

export const stats = {
  outcomes: outcomes.length,
  mappings: mappings.length,
  requirementsReferenced: new Set(mappings.flatMap((m) => m.links.map((l) => l.id))).size,
  unverified: outcomes.filter((o) => !o.verified).length,
};
