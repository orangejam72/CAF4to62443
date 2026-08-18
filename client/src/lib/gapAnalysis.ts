/**
 * Gap analysis engine.
 *
 * Ported from the original server/gapAnalysis.ts. Runs entirely in the browser
 * now — the calculation was always pure, it never needed a backend.
 *
 * Change from the original: statuses are derived per-outcome across the whole
 * selected inventory, so an outcome implemented on some systems but not others
 * is reported as "partial" rather than silently counted as implemented. The
 * original only ever produced "implemented" or "not_implemented", which made
 * the `partial` bucket permanently zero and inflated nothing — but also hid
 * genuine partial coverage.
 */

import { flatMappings, type FlatMapping } from "@/data";
import type { InventoryItem } from "./localStore";

export type ControlStatus = "implemented" | "partial" | "not_implemented";

export interface GapItem {
  mappingId: string;
  principle: string;
  itemName: string;
  objective: string;
  deviceTypes: string[];
  status: ControlStatus;
  isa62443_3_3: string;
  isa62443_4_2: string;
  recommendation: string;
  /** How many of the relevant systems declare this control implemented. */
  implementedOn: number;
  relevantSystems: number;
}

export interface CategorySummary {
  total: number;
  implemented: number;
  partial: number;
  notImplemented: number;
  percentage: string;
}

export interface GapAnalysisResult {
  totalControls: number;
  implementedControls: number;
  partiallyImplementedControls: number;
  notImplementedControls: number;
  compliancePercentage: string;
  gaps: GapItem[];
  summary: {
    byObjective: Record<string, CategorySummary>;
    byDeviceType: Record<string, CategorySummary>;
  };
  /** Outcomes whose CAF definition is not yet verified — surfaced, not hidden. */
  unverifiedOutcomeIds: string[];
}

function parseImplemented(item: InventoryItem): Set<string> {
  const out = new Set<string>();
  if (!item.implementedControls) return out;
  try {
    const parsed = JSON.parse(item.implementedControls);
    if (Array.isArray(parsed)) {
      parsed.forEach((c) => typeof c === "string" && out.add(c));
    }
  } catch {
    // Free-text or malformed entries are treated as "nothing declared".
  }
  return out;
}

function isRelevant(mapping: FlatMapping, deviceType: string): boolean {
  return (
    mapping.deviceTypes.includes("All") ||
    mapping.deviceTypes.some((dt) => dt.toLowerCase() === deviceType.toLowerCase())
  );
}

function emptySummary(): CategorySummary {
  return { total: 0, implemented: 0, partial: 0, notImplemented: 0, percentage: "0%" };
}

function tally(bucket: CategorySummary, status: ControlStatus): void {
  bucket.total += 1;
  if (status === "implemented") bucket.implemented += 1;
  else if (status === "partial") bucket.partial += 1;
  else bucket.notImplemented += 1;
}

function pct(implemented: number, partial: number, total: number): string {
  if (total === 0) return "0%";
  return `${Math.round(((implemented + partial * 0.5) / total) * 100)}%`;
}

export function performGapAnalysis(inventoryItems: InventoryItem[]): GapAnalysisResult {
  const declared = new Map<number, Set<string>>();
  inventoryItems.forEach((item) => declared.set(item.id, parseImplemented(item)));

  const deviceTypes = new Set(inventoryItems.map((i) => i.deviceType));

  const relevantMappings = flatMappings.filter(
    (m) => m.deviceTypes.includes("All") || [...deviceTypes].some((dt) => isRelevant(m, dt))
  );

  const byObjective: Record<string, CategorySummary> = {};
  const byDeviceType: Record<string, CategorySummary> = {};

  const gaps: GapItem[] = relevantMappings.map((mapping) => {
    // Only count systems this control actually applies to.
    const relevantSystems = inventoryItems.filter((i) => isRelevant(mapping, i.deviceType));
    const implementedOn = relevantSystems.filter((i) =>
      declared.get(i.id)?.has(mapping.id)
    ).length;

    let status: ControlStatus;
    if (relevantSystems.length === 0 || implementedOn === 0) status = "not_implemented";
    else if (implementedOn === relevantSystems.length) status = "implemented";
    else status = "partial";

    if (!byObjective[mapping.objective]) byObjective[mapping.objective] = emptySummary();
    tally(byObjective[mapping.objective], status);

    mapping.deviceTypes.forEach((dt) => {
      const key = dt.toLowerCase();
      if (!byDeviceType[key]) byDeviceType[key] = emptySummary();
      tally(byDeviceType[key], status);
    });

    return {
      mappingId: mapping.id,
      principle: mapping.principle,
      itemName: mapping.itemName,
      objective: mapping.objective,
      deviceTypes: mapping.deviceTypes,
      status,
      isa62443_3_3: mapping.isa62443_3_3,
      isa62443_4_2: mapping.isa62443_4_2,
      recommendation: recommend(mapping, status, implementedOn, relevantSystems.length),
      implementedOn,
      relevantSystems: relevantSystems.length,
    };
  });

  Object.values(byObjective).forEach((s) => {
    s.percentage = pct(s.implemented, s.partial, s.total);
  });
  Object.values(byDeviceType).forEach((s) => {
    s.percentage = pct(s.implemented, s.partial, s.total);
  });

  const implemented = gaps.filter((g) => g.status === "implemented").length;
  const partial = gaps.filter((g) => g.status === "partial").length;
  const notImplemented = gaps.filter((g) => g.status === "not_implemented").length;

  return {
    totalControls: gaps.length,
    implementedControls: implemented,
    partiallyImplementedControls: partial,
    notImplementedControls: notImplemented,
    compliancePercentage: pct(implemented, partial, gaps.length),
    gaps,
    summary: { byObjective, byDeviceType },
    unverifiedOutcomeIds: relevantMappings.filter((m) => !m.verified).map((m) => m.id),
  };
}

function recommend(
  mapping: FlatMapping,
  status: ControlStatus,
  implementedOn: number,
  relevantSystems: number
): string {
  const refs = [mapping.isa62443_3_3, mapping.isa62443_4_2]
    .filter((r) => r && r !== "—" && r !== "No mapping recorded")
    .join(" / ");

  if (status === "implemented") {
    return `Maintain ${mapping.itemName}. Evidence against ${refs || "the mapped 62443 requirements"}.`;
  }

  if (status === "partial") {
    return `${mapping.itemName} is declared on ${implementedOn} of ${relevantSystems} applicable systems. Close the gap on the remaining ${
      relevantSystems - implementedOn
    }, then evidence against ${refs || "the mapped 62443 requirements"}.`;
  }

  return `Implement ${mapping.itemName} across ${relevantSystems} applicable system(s), per ${
    refs || "the mapped 62443 requirements"
  }.`;
}
