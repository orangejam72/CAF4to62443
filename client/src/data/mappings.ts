/**
 * CAF 4.0 ⇄ IEC 62443 mapping corpus.
 *
 * This is the substance of the product. It replaces the original prototype's
 * 19 loose free-text mappings with full CAF 4.0 coverage against specific
 * 62443 requirement identifiers.
 *
 * ── How to read a mapping ────────────────────────────────────────────────
 * strength:
 *   "full"       — the 62443 requirement substantially delivers the CAF outcome
 *   "partial"    — contributes materially but is not sufficient alone
 *   "supporting" — provides evidence or enabling capability
 *
 * ── Provenance ───────────────────────────────────────────────────────────
 * "drafted"  — drafted by Claude from the two frameworks; NOT yet reviewed
 * "reviewed" — checked by a domain expert
 * "seeded"   — derived from the asset owner's existing control set
 *
 * ⚠️ Everything here is currently "drafted". These mappings are a starting
 * point for expert review, not a finished compliance artifact. CAF is
 * outcome-based and 62443 is prescriptive, so most links are matters of
 * professional judgement — reviewers are expected to disagree with some.
 */

import type { DeviceType } from "@/lib/localStore";

export type Strength = "full" | "partial" | "supporting";
export type Provenance = "drafted" | "reviewed" | "seeded";

export interface RequirementLink {
  /** Must exist in iec62443.ts — validated by `npm run validate:data`. */
  id: string;
  strength: Strength;
}

export interface Mapping {
  /** CAF contributing outcome id, e.g. "A1.a" */
  cafId: string;
  links: RequirementLink[];
  /** Why these requirements deliver this outcome. Our own words. */
  rationale: string;
  /** "All" or a subset of device types this is most relevant to. */
  deviceTypes: Array<DeviceType | "All">;
  keywords: string[];
  provenance: Provenance;
}

export const mappings: Mapping[] = [
  /* ── Objective A ──────────────────────────────────────────────────── */
  {
    cafId: "A1.a",
    links: [
      { id: "62443-2-1: Org & Policy", strength: "full" },
      { id: "62443-2-1: CSMS", strength: "partial" },
    ],
    rationale:
      "CAF asks for board-level direction and ownership. 62443-2-1 places the equivalent obligation on the asset owner's security management system: an organisational IACS security policy with assigned accountability. There is no 3-3 or 4-2 equivalent — this is a governance outcome and no technical control evidences it.",
    deviceTypes: ["All"],
    keywords: ["governance", "board", "policy", "accountability", "CSMS"],
    provenance: "drafted",
  },
  {
    cafId: "A1.b",
    links: [
      { id: "62443-2-1: Org & Policy", strength: "full" },
      { id: "62443-2-4: SP", strength: "partial" },
    ],
    rationale:
      "Defined and resourced security roles. 62443-2-1 requires assigned organisational accountability; 2-4 extends the same expectation to integration and maintenance service providers, which matters on an FPSO or HVDC scheme where much of the work is contracted.",
    deviceTypes: ["All"],
    keywords: ["roles", "responsibilities", "accountability", "service provider"],
    provenance: "drafted",
  },
  {
    cafId: "A1.c",
    links: [
      { id: "ZCR 7", strength: "full" },
      { id: "ZCR 4", strength: "partial" },
      { id: "62443-2-1: CSMS", strength: "supporting" },
    ],
    rationale:
      "CAF wants risk decisions taken at the right level with the right information. 62443-3-2 makes this concrete: ZCR 4 compares assessed risk against tolerable risk, and ZCR 7 requires the asset owner to formally approve the outcome. That approval step is the auditable decision record CAF is asking for.",
    deviceTypes: ["All"],
    keywords: ["decision", "risk appetite", "approval", "tolerable risk"],
    provenance: "drafted",
  },
  {
    cafId: "A2.a",
    links: [
      { id: "ZCR 2", strength: "full" },
      { id: "ZCR 5", strength: "full" },
      { id: "ZCR 1", strength: "partial" },
      { id: "62443-2-1: Risk", strength: "partial" },
    ],
    rationale:
      "62443-3-2 is the closest thing in the standard to CAF's risk management process: scope the system, assess initial risk, partition, then assess detailed risk per zone and conduit to derive target security levels. That last step — risk driving an SL-T — is exactly CAF's requirement that risk output drives decisions.",
    deviceTypes: ["All"],
    keywords: ["risk assessment", "zones", "conduits", "SL-T", "methodology"],
    provenance: "drafted",
  },
  {
    cafId: "A2.b",
    links: [
      { id: "ZCR 2", strength: "partial" },
      { id: "ZCR 5", strength: "partial" },
      { id: "62443-2-1: Risk", strength: "supporting" },
    ],
    rationale:
      "New in CAF 4.0 — a dedicated outcome for understanding attacker capability, intent and method. 62443 has no direct equivalent: its risk assessment is threat-informed but the standard does not require a maintained threat picture. This is a genuine gap where CAF asks for more than 62443. Treat threat-informed SL-T selection under ZCR 5 as partial evidence only.",
    deviceTypes: ["All"],
    keywords: ["threat intelligence", "attacker", "TTPs", "threat model", "gap"],
    provenance: "drafted",
  },
  {
    cafId: "A2.c",
    links: [
      { id: "62443-2-1: Conformance", strength: "full" },
      { id: "SR 3.3", strength: "partial" },
      { id: "62443-4-1: SVV", strength: "partial" },
    ],
    rationale:
      "Assurance that controls actually work. 62443-2-1 requires audit and review of the security programme; SR 3.3 requires the system to verify its own security functionality; 4-1 SVV covers pre-release security testing by the product supplier. Together these cover organisational, operational and product assurance.",
    deviceTypes: ["All"],
    keywords: ["assurance", "audit", "verification", "testing", "independent review"],
    provenance: "drafted",
  },
  {
    cafId: "A3.a",
    links: [
      { id: "SR 7.8", strength: "full" },
      { id: "CR 7.8", strength: "full" },
      { id: "ZCR 1", strength: "partial" },
    ],
    rationale:
      "Asset management maps cleanly. SR 7.8 requires an accurate control system component inventory and CR 7.8 requires components to report inventory data. ZCR 1 contributes the boundary definition — you cannot inventory what you have not scoped.",
    deviceTypes: ["embedded", "network", "host"],
    keywords: ["asset inventory", "CMDB", "component inventory", "scope"],
    provenance: "drafted",
  },
  {
    cafId: "A4.a",
    links: [
      { id: "62443-2-4: SP", strength: "full" },
      { id: "62443-4-1: SG", strength: "partial" },
      { id: "62443-2-1: CSMS", strength: "supporting" },
    ],
    rationale:
      "62443-2-4 exists precisely for this: security capability requirements an asset owner places on IACS service providers. 4-1 SG covers the hardening guidance a product supplier must hand over. On contractor-heavy assets this is usually where CAF supply chain evidence comes from.",
    deviceTypes: ["All"],
    keywords: ["supply chain", "vendor", "contractor", "service provider", "procurement"],
    provenance: "drafted",
  },
  {
    cafId: "A4.b",
    links: [
      { id: "62443-4-1: SM", strength: "full" },
      { id: "62443-4-1: SD", strength: "full" },
      { id: "62443-4-1: SI", strength: "partial" },
      { id: "62443-4-1: SUM", strength: "partial" },
      { id: "62443-4-1: DM", strength: "partial" },
      { id: "CR 3.10", strength: "supporting" },
    ],
    rationale:
      "New in CAF 4.0 and the strongest new alignment with 62443. The whole of 62443-4-1 is a secure product development lifecycle — management, requirements, secure design, implementation, verification, issue management, update management. For OT asset owners the practical evidence is requiring 4-1 certification from suppliers rather than developing in-house.",
    deviceTypes: ["All"],
    keywords: ["secure development", "SDL", "SSDF", "supplier", "software", "patching"],
    provenance: "drafted",
  },

  /* ── Objective B ──────────────────────────────────────────────────── */
  {
    cafId: "B1.a",
    links: [
      { id: "62443-2-1: Org & Policy", strength: "full" },
      { id: "ZCR 6", strength: "partial" },
    ],
    rationale:
      "Policy and process development. 62443-2-1 requires documented IACS security policy; ZCR 6 requires the Cyber Requirements Specification recording requirements, assumptions and constraints — the engineering counterpart to CAF's documented process.",
    deviceTypes: ["All"],
    keywords: ["policy", "process", "procedure", "CRS", "documentation"],
    provenance: "drafted",
  },
  {
    cafId: "B1.b",
    links: [
      { id: "62443-2-1: Conformance", strength: "full" },
      { id: "SR 7.6", strength: "partial" },
      { id: "CR 7.6", strength: "partial" },
    ],
    rationale:
      "CAF distinguishes writing policy from following it. The 62443 evidence for adherence is configuration baseline conformance — SR/CR 7.6 make the operational state auditable against the defined baseline, which is how you show process is followed rather than merely written.",
    deviceTypes: ["All"],
    keywords: ["implementation", "conformance", "baseline", "adherence", "audit"],
    provenance: "drafted",
  },
  {
    cafId: "B2.a",
    links: [
      { id: "SR 1.1", strength: "full" },
      { id: "SR 1.2", strength: "full" },
      { id: "SR 2.1", strength: "full" },
      { id: "CR 1.1", strength: "full" },
      { id: "CR 1.2", strength: "full" },
      { id: "CR 2.1", strength: "full" },
      { id: "SR 1.7", strength: "partial" },
      { id: "SR 1.9", strength: "partial" },
      { id: "SR 1.11", strength: "supporting" },
    ],
    rationale:
      "The densest mapping in the framework. CAF's identity/authentication/authorisation outcome corresponds almost one-to-one with FR1 and the authorisation enforcement requirement of FR2, at both system (3-3) and component (4-2) level. Note 62443 explicitly covers non-human identities (SR 1.2) — often the weak point in OT.",
    deviceTypes: ["embedded", "network", "host"],
    keywords: ["authentication", "authorisation", "identity", "least privilege", "MFA"],
    provenance: "drafted",
  },
  {
    cafId: "B2.b",
    links: [
      { id: "SR 2.3", strength: "full" },
      { id: "SR 1.2", strength: "partial" },
      { id: "CR 2.13", strength: "partial" },
      { id: "SR 1.6", strength: "partial" },
      { id: "NDR 1.6", strength: "partial" },
    ],
    rationale:
      "Device management. SR 2.3 controls portable and mobile device use; SR 1.2 authenticates devices; CR 2.13 protects physical diagnostic and test interfaces — the engineering-laptop-into-the-panel route that CAF device management is really about in an OT context.",
    deviceTypes: ["embedded", "network", "host"],
    keywords: ["device", "portable media", "engineering laptop", "diagnostic port", "wireless"],
    provenance: "drafted",
  },
  {
    cafId: "B2.c",
    links: [
      { id: "SR 1.3", strength: "full" },
      { id: "SR 2.1", strength: "full" },
      { id: "SR 2.7", strength: "partial" },
      { id: "SR 1.5", strength: "partial" },
      { id: "SR 2.12", strength: "supporting" },
      { id: "CR 2.12", strength: "supporting" },
    ],
    rationale:
      "Privileged user management. 62443 does not have a dedicated PAM requirement; the outcome is assembled from account management (SR 1.3), least-privilege authorisation (SR 2.1), credential management (SR 1.5) and non-repudiation (SR 2.12) for attribution of privileged actions.",
    deviceTypes: ["embedded", "network", "host"],
    keywords: ["privileged access", "PAM", "admin", "least privilege", "non-repudiation"],
    provenance: "drafted",
  },
  {
    cafId: "B2.d",
    links: [
      { id: "SR 1.3", strength: "full" },
      { id: "SR 1.4", strength: "full" },
      { id: "SR 1.5", strength: "full" },
      { id: "CR 1.5", strength: "partial" },
      { id: "SR 1.8", strength: "partial" },
    ],
    rationale:
      "Identity lifecycle. SR 1.3 account management, SR 1.4 identifier management and SR 1.5 authenticator management together cover joiners/movers/leavers. CR 1.5 matters because it drives out default credentials at component level — a persistent OT weakness.",
    deviceTypes: ["embedded", "network", "host"],
    keywords: ["IdAM", "lifecycle", "joiners movers leavers", "default credentials", "PKI"],
    provenance: "drafted",
  },
  {
    cafId: "B3.a",
    links: [
      { id: "ZCR 1", strength: "partial" },
      { id: "ZCR 3", strength: "partial" },
      { id: "SR 5.4", strength: "supporting" },
    ],
    rationale:
      "Understanding data. 62443 is system- and zone-oriented rather than data-oriented, so this maps weakly: zone partitioning (ZCR 3) and application partitioning (SR 5.4) imply understanding what data lives where, but the standard never requires a data inventory or classification scheme. A real gap where CAF asks for more.",
    deviceTypes: ["All"],
    keywords: ["data classification", "data flow", "data inventory", "gap"],
    provenance: "drafted",
  },
  {
    cafId: "B3.b",
    links: [
      { id: "SR 3.1", strength: "full" },
      { id: "SR 4.1", strength: "full" },
      { id: "CR 3.1", strength: "full" },
      { id: "CR 4.1", strength: "full" },
      { id: "SR 4.3", strength: "partial" },
      { id: "CR 4.3", strength: "partial" },
      { id: "SR 3.8", strength: "supporting" },
    ],
    rationale:
      "Data in transit maps cleanly onto communication integrity (FR3) plus information confidentiality and cryptography (FR4), at both system and component level. In OT, integrity usually matters more than confidentiality — SR 3.1 is typically the stronger requirement.",
    deviceTypes: ["network", "host", "embedded"],
    keywords: ["encryption", "TLS", "integrity", "data in transit", "cryptography"],
    provenance: "drafted",
  },
  {
    cafId: "B3.c",
    links: [
      { id: "SR 4.1", strength: "full" },
      { id: "SR 3.4", strength: "full" },
      { id: "CR 4.1", strength: "partial" },
      { id: "CR 3.4", strength: "partial" },
      { id: "SR 4.3", strength: "partial" },
    ],
    rationale:
      "Stored data. Confidentiality at rest (SR 4.1) plus software and information integrity (SR 3.4) — the latter is what detects unauthorised alteration of stored configuration and logic, which in an ICS is usually the more consequential risk.",
    deviceTypes: ["host", "embedded"],
    keywords: ["data at rest", "encryption", "integrity", "configuration", "logic"],
    provenance: "drafted",
  },
  {
    cafId: "B3.d",
    links: [
      { id: "SR 2.3", strength: "full" },
      { id: "SR 4.1", strength: "partial" },
      { id: "SR 1.6", strength: "supporting" },
    ],
    rationale:
      "Mobile data. SR 2.3 use control for portable and mobile devices is the direct match; confidentiality (SR 4.1) applies to what those devices carry. On offshore assets this is the USB-and-laptop transfer path in and out of the control network.",
    deviceTypes: ["host"],
    keywords: ["mobile", "removable media", "USB", "portable", "transfer"],
    provenance: "drafted",
  },
  {
    cafId: "B3.e",
    links: [
      { id: "SR 4.2", strength: "full" },
      { id: "CR 4.2", strength: "full" },
    ],
    rationale:
      "Media and equipment sanitisation maps directly and narrowly onto information persistence (SR/CR 4.2) — information must not persist beyond its intended life, which is the sanitisation-before-disposal-or-reuse requirement.",
    deviceTypes: ["embedded", "network", "host"],
    keywords: ["sanitisation", "disposal", "decommissioning", "data remanence"],
    provenance: "drafted",
  },
  {
    cafId: "B4.a",
    links: [
      { id: "SR 5.1", strength: "full" },
      { id: "SR 5.2", strength: "full" },
      { id: "ZCR 3", strength: "full" },
      { id: "SR 5.4", strength: "partial" },
      { id: "SR 5.3", strength: "partial" },
      { id: "NDR 5.2", strength: "partial" },
      { id: "62443-4-1: SD", strength: "partial" },
    ],
    rationale:
      "Secure by design is where 62443 is strongest and CAF is vaguest. The zone-and-conduit model (ZCR 3, SR 5.1, SR 5.2) is the canonical OT answer to CAF's 'designed with security built in'. If you cite one thing as evidence for B4.a on an ICS, cite the zone and conduit drawing.",
    deviceTypes: ["network", "embedded", "host"],
    keywords: ["segmentation", "zones", "conduits", "defence in depth", "architecture", "DMZ"],
    provenance: "drafted",
  },
  {
    cafId: "B4.b",
    links: [
      { id: "SR 7.6", strength: "full" },
      { id: "SR 7.7", strength: "full" },
      { id: "CR 7.6", strength: "full" },
      { id: "CR 7.7", strength: "full" },
      { id: "SR 2.4", strength: "partial" },
      { id: "CR 1.5", strength: "partial" },
    ],
    rationale:
      "Secure configuration. SR/CR 7.6 configuration baseline plus SR/CR 7.7 least functionality are the direct match — hardened, known-good state with unnecessary services removed. CR 1.5 is included because changing default credentials is the single most common secure-configuration finding in OT.",
    deviceTypes: ["embedded", "network", "host"],
    keywords: ["hardening", "baseline", "least functionality", "configuration", "defaults"],
    provenance: "drafted",
  },
  {
    cafId: "B4.c",
    links: [
      { id: "SR 1.13", strength: "full" },
      { id: "NDR 1.13", strength: "full" },
      { id: "SR 2.6", strength: "partial" },
      { id: "SR 2.5", strength: "partial" },
      { id: "SR 5.2", strength: "partial" },
      { id: "CR 2.13", strength: "partial" },
    ],
    rationale:
      "Secure management. CAF asks that management interfaces be protected and separated. 62443 delivers this through access via untrusted networks (SR/NDR 1.13), session controls (SR 2.5, 2.6), zone boundary protection for the management path, and protection of physical diagnostic interfaces. Remote vendor access is the usual pressure point.",
    deviceTypes: ["network", "host", "embedded"],
    keywords: ["remote access", "jump host", "management interface", "vendor access", "session"],
    provenance: "drafted",
  },
  {
    cafId: "B4.d",
    links: [
      { id: "62443-4-1: DM", strength: "full" },
      { id: "62443-4-1: SUM", strength: "full" },
      { id: "CR 3.10", strength: "full" },
      { id: "SR 3.2", strength: "partial" },
      { id: "SR 7.8", strength: "supporting" },
    ],
    rationale:
      "Vulnerability management. In OT the asset owner often cannot patch directly, so the mapping runs through the supplier: 4-1 DM (issue management) and SUM (update production) plus CR 3.10 (component supports authenticated updates). SR 7.8 inventory is the prerequisite — you cannot assess exposure without knowing what you run.",
    deviceTypes: ["embedded", "network", "host"],
    keywords: ["vulnerability", "patching", "CVE", "updates", "compensating controls"],
    provenance: "drafted",
  },
  {
    cafId: "B5.a",
    links: [
      { id: "ZCR 1", strength: "partial" },
      { id: "62443-2-1: Continuity", strength: "full" },
      { id: "SR 7.8", strength: "supporting" },
    ],
    rationale:
      "Resilience preparation — knowing what the essential function depends on. 62443-2-1 business continuity is the direct match; scope definition and inventory supply the dependency picture.",
    deviceTypes: ["All"],
    keywords: ["resilience", "dependencies", "continuity", "BCP", "criticality"],
    provenance: "drafted",
  },
  {
    cafId: "B5.b",
    links: [
      { id: "SR 7.1", strength: "full" },
      { id: "SR 7.2", strength: "full" },
      { id: "SR 3.6", strength: "full" },
      { id: "CR 7.1", strength: "partial" },
      { id: "CR 7.2", strength: "partial" },
      { id: "SR 5.1", strength: "partial" },
      { id: "SR 7.5", strength: "partial" },
    ],
    rationale:
      "Design for resilience. FR7 is the availability foundational requirement: DoS protection, resource management, emergency power. SR 3.6 deterministic output is the OT-specific one — on failure, outputs go to a predetermined safe state, which is exactly CAF's 'failure does not cascade into loss of the essential function'.",
    deviceTypes: ["embedded", "network", "host"],
    keywords: ["availability", "redundancy", "fail safe", "deterministic output", "DoS"],
    provenance: "drafted",
  },
  {
    cafId: "B5.c",
    links: [
      { id: "SR 7.3", strength: "full" },
      { id: "SR 7.4", strength: "full" },
      { id: "CR 7.3", strength: "partial" },
      { id: "CR 7.4", strength: "partial" },
      { id: "SR 3.4", strength: "supporting" },
    ],
    rationale:
      "Backups. SR 7.3 requires backup without disrupting operation; SR 7.4 requires recovery and reconstitution to a known secure state — which is CAF's tested-restoration requirement. SR 3.4 supports it by detecting whether the backed-up image has been altered.",
    deviceTypes: ["embedded", "network", "host"],
    keywords: ["backup", "restore", "recovery", "reconstitution", "golden image"],
    provenance: "drafted",
  },
  {
    cafId: "B6.a",
    links: [{ id: "62443-2-1: Training", strength: "partial" }],
    rationale:
      "Cyber security culture. 62443-2-1 covers personnel security, training and awareness, but CAF asks for something broader — that people can raise concerns without penalty. The standard has no equivalent to psychological safety. Weak mapping; expect to evidence this outside 62443.",
    deviceTypes: ["All"],
    keywords: ["culture", "awareness", "reporting", "behaviour", "gap"],
    provenance: "drafted",
  },
  {
    cafId: "B6.b",
    links: [
      { id: "62443-2-1: Training", strength: "full" },
      { id: "62443-2-4: SP", strength: "partial" },
      { id: "62443-4-1: SG", strength: "supporting" },
    ],
    rationale:
      "Role-specific training. 62443-2-1 requires personnel with IACS security responsibilities to be trained and competent; 2-4 extends competence requirements to service provider personnel; 4-1 SG is the supplier's security guidance that operators must be trained against.",
    deviceTypes: ["All"],
    keywords: ["training", "competence", "role-based", "contractor"],
    provenance: "drafted",
  },

  /* ── Objective C ──────────────────────────────────────────────────── */
  {
    cafId: "C1.a",
    links: [
      { id: "SR 2.8", strength: "full" },
      { id: "SR 6.2", strength: "full" },
      { id: "CR 2.8", strength: "full" },
      { id: "CR 6.2", strength: "partial" },
      { id: "SR 2.9", strength: "partial" },
      { id: "SR 2.11", strength: "partial" },
      { id: "CR 2.11", strength: "supporting" },
    ],
    rationale:
      "Monitoring sources and coverage. SR 2.8 auditable events defines what gets logged, SR 6.2 continuous monitoring defines the ongoing capability, SR 2.9 covers retention capacity and SR 2.11 the synchronised timestamps without which correlation is impossible.",
    deviceTypes: ["network", "host", "embedded"],
    keywords: ["logging", "monitoring", "SIEM", "retention", "time sync", "coverage"],
    provenance: "drafted",
  },
  {
    cafId: "C1.b",
    links: [
      { id: "SR 3.9", strength: "full" },
      { id: "CR 3.9", strength: "full" },
      { id: "SR 2.10", strength: "partial" },
      { id: "SR 6.1", strength: "supporting" },
    ],
    rationale:
      "Securing logs maps directly onto protection of audit information (SR/CR 3.9). SR 2.10 adds detection of failures in the audit mechanism itself — a silently-stopped log is the failure mode CAF is guarding against.",
    deviceTypes: ["network", "host", "embedded"],
    keywords: ["log integrity", "tamper", "audit protection", "WORM", "log failure"],
    provenance: "drafted",
  },
  {
    cafId: "C1.c",
    links: [
      { id: "SR 6.2", strength: "partial" },
      { id: "SR 6.1", strength: "partial" },
      { id: "SR 2.10", strength: "supporting" },
    ],
    rationale:
      "Generating alerts. CAF 4.0 expanded this to require enrichment, correlation and behavioural baselining. 62443 requires continuous monitoring and accessible audit logs but does not describe alerting logic or baselining at all. Partial mapping — this is a CAF-ahead-of-62443 area.",
    deviceTypes: ["network", "host"],
    keywords: ["alerting", "correlation", "enrichment", "baselining", "gap"],
    provenance: "drafted",
  },
  {
    cafId: "C1.d",
    links: [
      { id: "62443-2-1: Incident", strength: "full" },
      { id: "SR 6.1", strength: "partial" },
    ],
    rationale:
      "Responding to alerts. New emphasis in CAF 4.0 on triage as a resourced process within operational timescales. 62443-2-1 incident planning and response is the organisational match; SR 6.1 makes the evidence accessible to the responder.",
    deviceTypes: ["network", "host"],
    keywords: ["triage", "alert response", "SOC", "playbook", "escalation"],
    provenance: "drafted",
  },
  {
    cafId: "C1.e",
    links: [
      { id: "62443-2-1: Conformance", strength: "partial" },
      { id: "SR 3.3", strength: "partial" },
    ],
    rationale:
      "Maintaining monitoring effectiveness as the estate and threat change. 62443 has no requirement to review detection coverage over time; the nearest analogues are programme review (2-1 conformance) and security functionality verification (SR 3.3). Weak mapping — another CAF 4.0 addition without a 62443 counterpart.",
    deviceTypes: ["network", "host"],
    keywords: ["detection engineering", "coverage review", "tuning", "gap"],
    provenance: "drafted",
  },
  {
    cafId: "C2.a",
    links: [{ id: "SR 6.2", strength: "supporting" }],
    rationale:
      "Threat hunting is new as a CAF 4.0 principle and has no counterpart in 62443 at all. The standard is built around detecting defined events, not proactively searching for what detections missed. Continuous monitoring provides the telemetry a hunt would use, but nothing more. This is the single largest gap between the two frameworks — flag it explicitly in assessments rather than claiming coverage.",
    deviceTypes: ["network", "host"],
    keywords: ["threat hunting", "proactive", "hypothesis", "gap", "new in 4.0"],
    provenance: "drafted",
  },

  /* ── Objective D ──────────────────────────────────────────────────── */
  {
    cafId: "D1.a",
    links: [
      { id: "62443-2-1: Incident", strength: "full" },
      { id: "62443-2-1: Continuity", strength: "full" },
      { id: "SR 7.4", strength: "partial" },
    ],
    rationale:
      "Response and recovery planning maps onto 62443-2-1 incident planning plus business continuity and disaster recovery. SR 7.4 supplies the technical recovery-to-known-secure-state capability the plan depends on.",
    deviceTypes: ["All"],
    keywords: ["incident response", "recovery plan", "continuity", "DR", "scenarios"],
    provenance: "drafted",
  },
  {
    cafId: "D1.b",
    links: [
      { id: "62443-2-1: Incident", strength: "full" },
      { id: "SR 7.3", strength: "partial" },
      { id: "SR 7.4", strength: "partial" },
      { id: "62443-2-4: SP", strength: "supporting" },
    ],
    rationale:
      "Having the capability, not just the plan. Backup (SR 7.3) and recovery/reconstitution (SR 7.4) are the technical capability; 2-4 matters where the recovery capability sits with a service provider rather than in-house, which is common offshore.",
    deviceTypes: ["All"],
    keywords: ["response capability", "resources", "recovery", "on-call", "service provider"],
    provenance: "drafted",
  },
  {
    cafId: "D1.c",
    links: [
      { id: "62443-2-1: Continuity", strength: "partial" },
      { id: "62443-2-1: Conformance", strength: "partial" },
    ],
    rationale:
      "Testing and exercising. CAF 4.0 strengthened this to require realistic tested scenarios including ransomware and supplier failure. 62443-2-1 implies exercise through continuity and conformance review but does not mandate scenario exercises. Partial at best. ⚠️ This outcome is also unverified against the CAF 4.0 source — see UNVERIFIED.md.",
    deviceTypes: ["All"],
    keywords: ["exercise", "tabletop", "testing", "ransomware", "scenario", "gap"],
    provenance: "drafted",
  },
  {
    cafId: "D2.a",
    links: [{ id: "62443-2-1: Incident", strength: "full" }],
    rationale:
      "Root cause analysis of incidents and near misses. 62443-2-1's incident planning and response element includes learning from incidents; this is the direct organisational match.",
    deviceTypes: ["All"],
    keywords: ["lessons learned", "root cause", "post-incident", "near miss"],
    provenance: "drafted",
  },
  {
    cafId: "D2.b",
    links: [
      { id: "62443-2-1: Incident", strength: "partial" },
      { id: "62443-2-1: Conformance", strength: "partial" },
    ],
    rationale:
      "Turning lessons into implemented change and tracking it to completion. 62443-2-1's continuous improvement expectation covers this in principle but without CAF's emphasis on tracking closure. ⚠️ This outcome is also unverified against the CAF 4.0 source — see UNVERIFIED.md.",
    deviceTypes: ["All"],
    keywords: ["continuous improvement", "corrective action", "tracking", "closure"],
    provenance: "drafted",
  },
];

export const mappingByCafId = Object.fromEntries(mappings.map((m) => [m.cafId, m]));
