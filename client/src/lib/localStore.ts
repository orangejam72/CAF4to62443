/**
 * Local persistence layer.
 *
 * Replaces the original Manus stack (Express + tRPC + MySQL/Drizzle + Manus OAuth)
 * with browser-local storage. There is no server, no database and no login:
 * everything lives in the user's browser and can be exported/imported as JSON.
 *
 * Rationale: this is a reference and analysis tool, not a multi-user system of
 * record. Removing the backend makes it deployable as a static site on Vercel
 * with zero configuration, zero secrets and zero running cost.
 */

export type DeviceType = "embedded" | "network" | "host";
export type Criticality = "critical" | "high" | "medium" | "low";

export interface InventoryItem {
  id: number;
  systemName: string;
  systemType: string;
  deviceType: DeviceType;
  manufacturer?: string | null;
  model?: string | null;
  firmwareVersion?: string | null;
  location?: string | null;
  criticality?: Criticality | null;
  /** JSON-encoded array of CAF outcome ids, e.g. '["A1.a","B2.a"]' */
  implementedControls?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface ComplianceAssessment {
  id: number;
  assessmentName: string;
  description?: string | null;
  totalControls: number;
  implementedControls: number;
  partiallyImplementedControls: number;
  notImplementedControls: number;
  compliancePercentage: string;
  /** JSON-encoded GapAnalysisResult */
  gapAnalysisData?: string | null;
  /** JSON-encoded number[] */
  inventoryIds?: string | null;
  createdAt: string;
}

export interface StoreSnapshot {
  version: 1;
  exportedAt: string;
  inventory: InventoryItem[];
  assessments: ComplianceAssessment[];
}

const INVENTORY_KEY = "caf4to62443.inventory.v1";
const ASSESSMENT_KEY = "caf4to62443.assessments.v1";

/** Bumped on every write; subscribers re-read. */
let revision = 0;
const listeners = new Set<() => void>();

function emit() {
  revision += 1;
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getRevision(): number {
  return revision;
}

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    // Corrupted payload should degrade to "empty", never crash the app.
    console.warn(`[localStore] could not parse ${key}; treating as empty`);
    return [];
  }
}

function write<T>(key: string, value: T[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // Most likely QuotaExceededError.
    console.error(`[localStore] failed to write ${key}`, err);
    throw new Error(
      "Could not save — browser storage is full. Export your data and clear some space."
    );
  }
  emit();
}

function nextId(rows: Array<{ id: number }>): number {
  return rows.reduce((max, r) => Math.max(max, r.id), 0) + 1;
}

/* ------------------------------------------------------------------ */
/* Inventory                                                           */
/* ------------------------------------------------------------------ */

export function listInventory(): InventoryItem[] {
  return read<InventoryItem>(INVENTORY_KEY).sort((a, b) => b.id - a.id);
}

export type NewInventoryItem = Omit<InventoryItem, "id" | "createdAt">;

export function createInventoryItem(input: NewInventoryItem): InventoryItem {
  const rows = read<InventoryItem>(INVENTORY_KEY);
  const item: InventoryItem = {
    ...input,
    id: nextId(rows),
    createdAt: new Date().toISOString(),
  };
  write(INVENTORY_KEY, [...rows, item]);
  return item;
}

export function updateInventoryItem(
  id: number,
  patch: Partial<NewInventoryItem>
): InventoryItem | undefined {
  const rows = read<InventoryItem>(INVENTORY_KEY);
  let updated: InventoryItem | undefined;
  const next = rows.map((r) => {
    if (r.id !== id) return r;
    updated = { ...r, ...patch };
    return updated;
  });
  write(INVENTORY_KEY, next);
  return updated;
}

export function deleteInventoryItem(id: number): void {
  const rows = read<InventoryItem>(INVENTORY_KEY);
  write(
    INVENTORY_KEY,
    rows.filter((r) => r.id !== id)
  );
}

/* ------------------------------------------------------------------ */
/* Assessments                                                         */
/* ------------------------------------------------------------------ */

export function listAssessments(): ComplianceAssessment[] {
  return read<ComplianceAssessment>(ASSESSMENT_KEY).sort((a, b) => b.id - a.id);
}

export type NewAssessment = Omit<ComplianceAssessment, "id" | "createdAt">;

export function createAssessment(input: NewAssessment): ComplianceAssessment {
  const rows = read<ComplianceAssessment>(ASSESSMENT_KEY);
  const row: ComplianceAssessment = {
    ...input,
    id: nextId(rows),
    createdAt: new Date().toISOString(),
  };
  write(ASSESSMENT_KEY, [...rows, row]);
  return row;
}

export function getAssessmentById(id: number): ComplianceAssessment | undefined {
  return read<ComplianceAssessment>(ASSESSMENT_KEY).find((r) => r.id === id);
}

export function deleteAssessment(id: number): void {
  const rows = read<ComplianceAssessment>(ASSESSMENT_KEY);
  write(
    ASSESSMENT_KEY,
    rows.filter((r) => r.id !== id)
  );
}

/* ------------------------------------------------------------------ */
/* Backup / portability                                                */
/* ------------------------------------------------------------------ */

export function exportSnapshot(): StoreSnapshot {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    inventory: listInventory(),
    assessments: listAssessments(),
  };
}

export function downloadSnapshot(): void {
  const blob = new Blob([JSON.stringify(exportSnapshot(), null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `caf4to62443-data-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export interface ImportResult {
  inventory: number;
  assessments: number;
}

/**
 * Replaces all local data with the contents of a previously exported snapshot.
 * Throws with a human-readable message if the payload is not a valid snapshot.
 */
export function importSnapshot(json: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("That file isn't valid JSON.");
  }

  const snap = parsed as Partial<StoreSnapshot>;
  if (!snap || !Array.isArray(snap.inventory) || !Array.isArray(snap.assessments)) {
    throw new Error(
      "That doesn't look like a CAF4to62443 export — expected 'inventory' and 'assessments' arrays."
    );
  }

  write(INVENTORY_KEY, snap.inventory);
  write(ASSESSMENT_KEY, snap.assessments);

  return {
    inventory: snap.inventory.length,
    assessments: snap.assessments.length,
  };
}

export function clearAll(): void {
  write(INVENTORY_KEY, []);
  write(ASSESSMENT_KEY, []);
}
