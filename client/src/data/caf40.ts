/**
 * NCSC Cyber Assessment Framework 4.0 — structure.
 *
 * CAF 4.0 was published on 6 August 2025. Objectives, principles and
 * contributing outcome codes/titles below are transcribed from the official
 * NCSC publication:
 *   https://www.ncsc.gov.uk/files/NCSC-Cyber-Assessment-Framework-4.0.pdf
 *
 * CAF is Crown Copyright, published under the Open Government Licence.
 * The `summary` fields are our own plain-English paraphrase, not NCSC text.
 *
 * ── Verification status ──────────────────────────────────────────────────
 * `verified: true`  — code and title transcribed directly from the NCSC PDF.
 * `verified: false` — provisional. Carried forward from CAF 3.x because the
 *                     automated read of the PDF's Objective D section was
 *                     unreliable. NCSC states CAF 4.0 has 41 contributing
 *                     outcomes; this file lists 40, so at least one entry in
 *                     Objective D still needs confirming against the source.
 *                     See UNVERIFIED.md. Do not treat Objective D as final.
 */

export type ObjectiveId = "A" | "B" | "C" | "D";

export interface CafObjective {
  id: ObjectiveId;
  name: string;
  summary: string;
}

export interface CafPrinciple {
  id: string;
  objective: ObjectiveId;
  name: string;
}

export interface CafOutcome {
  /** e.g. "A1.a" */
  id: string;
  objective: ObjectiveId;
  principle: string;
  /** e.g. "Board Direction" */
  name: string;
  /** Our own paraphrase of what the outcome asks for. */
  summary: string;
  /** True when transcribed directly from the NCSC 4.0 PDF. */
  verified: boolean;
  /** Set where 4.0 introduced or materially changed this outcome. */
  newIn40?: boolean;
}

export const CAF_VERSION = "4.0";
export const CAF_PUBLISHED = "2025-08-06";
/** NCSC's stated total. Our transcription currently holds 40 — see UNVERIFIED.md. */
export const CAF_STATED_OUTCOME_COUNT = 41;

export const objectives: CafObjective[] = [
  {
    id: "A",
    name: "Managing security risk",
    summary:
      "Governance, risk management, asset management and supply chain — the organisational structures that make good security decisions possible.",
  },
  {
    id: "B",
    name: "Protecting against cyber attack",
    summary:
      "The proportionate security measures that protect essential functions from attack: access control, data security, system security, resilience and people.",
  },
  {
    id: "C",
    name: "Detecting cyber security events",
    summary:
      "The capability to monitor for, and actively hunt, indications of compromise affecting essential functions.",
  },
  {
    id: "D",
    name: "Minimising the impact of cyber security incidents",
    summary:
      "Planning, response, recovery and organisational learning that limit the damage an incident causes.",
  },
];

export const principles: CafPrinciple[] = [
  { id: "A1", objective: "A", name: "Governance" },
  { id: "A2", objective: "A", name: "Risk Management" },
  { id: "A3", objective: "A", name: "Asset Management" },
  { id: "A4", objective: "A", name: "Supply Chain" },
  { id: "B1", objective: "B", name: "Service Protection Policies, Processes and Procedures" },
  { id: "B2", objective: "B", name: "Identity and Access Control" },
  { id: "B3", objective: "B", name: "Data Security" },
  { id: "B4", objective: "B", name: "System Security" },
  { id: "B5", objective: "B", name: "Resilient Networks and Systems" },
  { id: "B6", objective: "B", name: "Staff Awareness and Training" },
  { id: "C1", objective: "C", name: "Security Monitoring" },
  { id: "C2", objective: "C", name: "Threat Hunting" },
  { id: "D1", objective: "D", name: "Response and Recovery Planning" },
  { id: "D2", objective: "D", name: "Lessons Learned" },
];

export const outcomes: CafOutcome[] = [
  /* ── Objective A — Managing security risk ─────────────────────────── */
  {
    id: "A1.a",
    objective: "A",
    principle: "A1",
    name: "Board Direction",
    summary:
      "Security of the essential function is directed and owned at board level, with clear articulation of risk appetite and visible senior accountability.",
    verified: true,
  },
  {
    id: "A1.b",
    objective: "A",
    principle: "A1",
    name: "Roles and Responsibilities",
    summary:
      "Security roles and responsibilities for the essential function are defined, allocated to named people, and backed by the authority and resource to act.",
    verified: true,
  },
  {
    id: "A1.c",
    objective: "A",
    principle: "A1",
    name: "Decision-making",
    summary:
      "Security risk decisions are made by people with the right information and authority, at the right level, and are traceable.",
    verified: true,
  },
  {
    id: "A2.a",
    objective: "A",
    principle: "A2",
    name: "Risk Management Process",
    summary:
      "A systematic, repeatable process identifies, analyses, prioritises and manages security risks to the essential function, and its outputs actually drive decisions.",
    verified: true,
  },
  {
    id: "A2.b",
    objective: "A",
    principle: "A2",
    name: "Understanding Threat",
    summary:
      "The organisation maintains an informed understanding of the threats it faces — actors, capability, intent and methods — and feeds that into risk decisions.",
    verified: true,
    newIn40: true,
  },
  {
    id: "A2.c",
    objective: "A",
    principle: "A2",
    name: "Assurance",
    summary:
      "Security measures are independently validated as working as intended, rather than assumed to work because they were specified.",
    verified: true,
  },
  {
    id: "A3.a",
    objective: "A",
    principle: "A3",
    name: "Asset Management",
    summary:
      "All assets supporting the essential function — systems, data, people, dependencies — are identified, understood and kept current.",
    verified: true,
  },
  {
    id: "A4.a",
    objective: "A",
    principle: "A4",
    name: "Supply Chain",
    summary:
      "Risks arising from suppliers and third parties are understood and managed, with security expectations set contractually and verified.",
    verified: true,
  },
  {
    id: "A4.b",
    objective: "A",
    principle: "A4",
    name: "Secure Software Development and Support",
    summary:
      "Software supporting the essential function — developed in-house or acquired — is built, maintained and supported securely across its lifecycle.",
    verified: true,
    newIn40: true,
  },

  /* ── Objective B — Protecting against cyber attack ────────────────── */
  {
    id: "B1.a",
    objective: "B",
    principle: "B1",
    name: "Policy, Process and Procedure Development",
    summary:
      "Security policies, processes and procedures are defined, are grounded in the organisation's risk position, and are actually workable.",
    verified: true,
  },
  {
    id: "B1.b",
    objective: "B",
    principle: "B1",
    name: "Policy, Process and Procedure Implementation",
    summary:
      "Those policies and processes are followed in practice, with deviations detected and addressed rather than tolerated.",
    verified: true,
  },
  {
    id: "B2.a",
    objective: "B",
    principle: "B2",
    name: "Identity Verification, Authentication and Authorisation",
    summary:
      "Users, devices and systems are reliably identified and authenticated before being granted access, and are authorised only for what they need.",
    verified: true,
  },
  {
    id: "B2.b",
    objective: "B",
    principle: "B2",
    name: "Device Management",
    summary:
      "Devices used to access the essential function are known, trusted and managed to a defined security state.",
    verified: true,
  },
  {
    id: "B2.c",
    objective: "B",
    principle: "B2",
    name: "Privileged User Management",
    summary:
      "Privileged access is tightly limited, separately controlled, monitored and regularly reviewed.",
    verified: true,
  },
  {
    id: "B2.d",
    objective: "B",
    principle: "B2",
    name: "Identity and Access Management (IdAM)",
    summary:
      "Identities and their access rights are managed through their full lifecycle — joiners, movers, leavers — so entitlement never drifts from need.",
    verified: true,
  },
  {
    id: "B3.a",
    objective: "B",
    principle: "B3",
    name: "Understanding Data",
    summary:
      "The data essential to the function is identified, classified, and its flows and dependencies understood.",
    verified: true,
  },
  {
    id: "B3.b",
    objective: "B",
    principle: "B3",
    name: "Data in Transit",
    summary:
      "Data moving between systems, sites and organisations is protected against interception and modification.",
    verified: true,
  },
  {
    id: "B3.c",
    objective: "B",
    principle: "B3",
    name: "Stored Data",
    summary:
      "Data at rest is protected against unauthorised access and undetected alteration, proportionate to its importance.",
    verified: true,
  },
  {
    id: "B3.d",
    objective: "B",
    principle: "B3",
    name: "Mobile Data",
    summary:
      "Data on mobile and removable media is protected, and its movement into and out of the operational environment is controlled.",
    verified: true,
  },
  {
    id: "B3.e",
    objective: "B",
    principle: "B3",
    name: "Media / Equipment Sanitisation",
    summary:
      "Media and equipment are sanitised before reuse or disposal so that residual data cannot be recovered.",
    verified: true,
  },
  {
    id: "B4.a",
    objective: "B",
    principle: "B4",
    name: "Secure by Design",
    summary:
      "Systems supporting the essential function are designed with security built in — segmentation, minimised attack surface, defence in depth.",
    verified: true,
  },
  {
    id: "B4.b",
    objective: "B",
    principle: "B4",
    name: "Secure Configuration",
    summary:
      "Systems are built and maintained to a known-good, hardened configuration, with unnecessary functionality removed.",
    verified: true,
  },
  {
    id: "B4.c",
    objective: "B",
    principle: "B4",
    name: "Secure Management",
    summary:
      "Management and administrative interfaces are protected, separated from general-purpose environments, and their use is controlled.",
    verified: true,
  },
  {
    id: "B4.d",
    objective: "B",
    principle: "B4",
    name: "Vulnerability Management",
    summary:
      "Vulnerabilities are found, triaged against risk to the essential function, and remediated or mitigated within defined timescales.",
    verified: true,
  },
  {
    id: "B5.a",
    objective: "B",
    principle: "B5",
    name: "Resilience Preparation",
    summary:
      "The organisation understands what the essential function depends on and has prepared for the loss of those dependencies.",
    verified: true,
  },
  {
    id: "B5.b",
    objective: "B",
    principle: "B5",
    name: "Design for Resilience",
    summary:
      "Networks and systems are designed so that a failure or compromise in one part does not cascade into loss of the essential function.",
    verified: true,
  },
  {
    id: "B5.c",
    objective: "B",
    principle: "B5",
    name: "Backups",
    summary:
      "Backups adequate to restore the essential function exist, are protected from the same compromise as the live system, and are tested by restoration.",
    verified: true,
  },
  {
    id: "B6.a",
    objective: "B",
    principle: "B6",
    name: "Cyber Security Culture",
    summary:
      "People understand why security matters to the essential function and are able to raise concerns without penalty.",
    verified: true,
  },
  {
    id: "B6.b",
    objective: "B",
    principle: "B6",
    name: "Cyber Security Training",
    summary:
      "People are trained for the specific security responsibilities their role carries, and the training is refreshed and effective.",
    verified: true,
  },

  /* ── Objective C — Detecting cyber security events ────────────────── */
  {
    id: "C1.a",
    objective: "C",
    principle: "C1",
    name: "Sources and Tools for Logging and Monitoring",
    summary:
      "Monitoring covers the systems and data sources that matter to the essential function, with enough fidelity and retention to be useful.",
    verified: true,
    newIn40: true,
  },
  {
    id: "C1.b",
    objective: "C",
    principle: "C1",
    name: "Securing Logs",
    summary:
      "Logs are protected against tampering and deletion, so they remain trustworthy evidence during and after an incident.",
    verified: true,
  },
  {
    id: "C1.c",
    objective: "C",
    principle: "C1",
    name: "Generating Alerts",
    summary:
      "Monitoring data is enriched, correlated and baselined so that meaningful alerts are produced rather than raw noise.",
    verified: true,
    newIn40: true,
  },
  {
    id: "C1.d",
    objective: "C",
    principle: "C1",
    name: "Responding to Alerts",
    summary:
      "Alerts are triaged and acted on through a defined, resourced process within timescales that matter operationally.",
    verified: true,
    newIn40: true,
  },
  {
    id: "C1.e",
    objective: "C",
    principle: "C1",
    name: "Maintaining Monitoring Effectiveness",
    summary:
      "Monitoring coverage and detection logic are reviewed and updated as the estate and the threat change.",
    verified: true,
    newIn40: true,
  },
  {
    id: "C2.a",
    objective: "C",
    principle: "C2",
    name: "Threat Hunting",
    summary:
      "The organisation proactively searches for compromise that existing detections did not catch, and turns findings into repeatable detections.",
    verified: true,
    newIn40: true,
  },

  /* ── Objective D — Minimising the impact of incidents ─────────────── */
  {
    id: "D1.a",
    objective: "D",
    principle: "D1",
    name: "Response and Recovery Planning",
    summary:
      "Incident response and recovery plans exist, are grounded in realistic scenarios, and cover the essential function end to end.",
    verified: true,
  },
  {
    id: "D1.b",
    objective: "D",
    principle: "D1",
    name: "Response and Recovery Implementation",
    summary:
      "The capability, people and resources to execute those plans exist and are available when needed.",
    verified: true,
  },
  {
    id: "D1.c",
    objective: "D",
    principle: "D1",
    name: "Testing and Exercising",
    summary:
      "Plans are exercised against realistic scenarios — including ransomware and supplier failure — and the results drive improvement.",
    verified: false,
  },
  {
    id: "D2.a",
    objective: "D",
    principle: "D2",
    name: "Lessons Learned",
    summary:
      "Incidents and near misses are analysed for root cause, and the findings are captured.",
    verified: true,
  },
  {
    id: "D2.b",
    objective: "D",
    principle: "D2",
    name: "Using Incidents to Drive Improvements",
    summary:
      "Lessons identified are actually implemented as changes to systems, processes and training, and the change is tracked to completion.",
    verified: false,
  },
];

export const objectiveById = Object.fromEntries(objectives.map((o) => [o.id, o]));
export const principleById = Object.fromEntries(principles.map((p) => [p.id, p]));
export const outcomeById = Object.fromEntries(outcomes.map((o) => [o.id, o]));

export const unverifiedOutcomes = outcomes.filter((o) => !o.verified);
