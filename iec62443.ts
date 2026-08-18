/**
 * IEC/ISA 62443 requirement catalogue.
 *
 * ⚠️ COPYRIGHT NOTICE
 * IEC 62443 is a paid standard and its clause text is copyrighted. This file
 * deliberately contains ONLY:
 *   • requirement identifiers (e.g. "SR 1.1") — references, not protected text
 *   • short factual requirement titles
 *   • our OWN plain-English summary of intent
 * It must never contain verbatim clause text from the standard. Anyone editing
 * this file should keep it that way.
 *
 * Identifiers follow the published numbering of:
 *   62443-2-1  IACS security programme requirements (asset owner)
 *   62443-2-4  Security programme requirements for service providers
 *   62443-3-2  Security risk assessment for system design (zones & conduits)
 *   62443-3-3  System security requirements and security levels
 *   62443-4-1  Secure product development lifecycle requirements
 *   62443-4-2  Technical security requirements for IACS components
 */

export type Part =
  | "62443-2-1"
  | "62443-2-4"
  | "62443-3-2"
  | "62443-3-3"
  | "62443-4-1"
  | "62443-4-2";

/** Foundational Requirements defined in 62443-1-1 and used throughout 3-3 / 4-2. */
export type FrId = "FR1" | "FR2" | "FR3" | "FR4" | "FR5" | "FR6" | "FR7";

export interface FoundationalRequirement {
  id: FrId;
  abbrev: string;
  name: string;
  summary: string;
}

export const foundationalRequirements: FoundationalRequirement[] = [
  {
    id: "FR1",
    abbrev: "IAC",
    name: "Identification and Authentication Control",
    summary: "Identify and authenticate all users, processes and devices before granting access.",
  },
  {
    id: "FR2",
    abbrev: "UC",
    name: "Use Control",
    summary: "Enforce the privileges assigned to an authenticated entity and audit their use.",
  },
  {
    id: "FR3",
    abbrev: "SI",
    name: "System Integrity",
    summary: "Ensure the integrity of the control system and its data against unauthorised change.",
  },
  {
    id: "FR4",
    abbrev: "DC",
    name: "Data Confidentiality",
    summary: "Prevent unauthorised disclosure of information at rest and in transit.",
  },
  {
    id: "FR5",
    abbrev: "RDF",
    name: "Restricted Data Flow",
    summary: "Segment the system into zones and conduits and restrict flow to what is necessary.",
  },
  {
    id: "FR6",
    abbrev: "TRE",
    name: "Timely Response to Events",
    summary: "Detect security events, make evidence available, and respond in time to matter.",
  },
  {
    id: "FR7",
    abbrev: "RA",
    name: "Resource Availability",
    summary: "Keep the control system available and degrade gracefully under stress or attack.",
  },
];

export interface Requirement {
  /** e.g. "SR 1.1", "CR 2.1", "ZCR 3", "SM-4" */
  id: string;
  part: Part;
  title: string;
  fr?: FrId;
  /** Our own words — never standard text. */
  summary: string;
}

/* ── 62443-3-3 — System Requirements ──────────────────────────────────── */

export const systemRequirements: Requirement[] = [
  // FR1 — Identification and Authentication Control
  { id: "SR 1.1", part: "62443-3-3", fr: "FR1", title: "Human user identification and authentication", summary: "Uniquely identify and authenticate every human user of the control system." },
  { id: "SR 1.2", part: "62443-3-3", fr: "FR1", title: "Software process and device identification and authentication", summary: "Identify and authenticate software processes and devices, not just people." },
  { id: "SR 1.3", part: "62443-3-3", fr: "FR1", title: "Account management", summary: "Manage the full lifecycle of accounts, including review and removal." },
  { id: "SR 1.4", part: "62443-3-3", fr: "FR1", title: "Identifier management", summary: "Control the allocation and reuse of identifiers." },
  { id: "SR 1.5", part: "62443-3-3", fr: "FR1", title: "Authenticator management", summary: "Manage credentials securely — issue, store, change, revoke." },
  { id: "SR 1.6", part: "62443-3-3", fr: "FR1", title: "Wireless access management", summary: "Identify, authenticate and control all wireless access." },
  { id: "SR 1.7", part: "62443-3-3", fr: "FR1", title: "Strength of password-based authentication", summary: "Enforce password strength appropriate to the security level." },
  { id: "SR 1.8", part: "62443-3-3", fr: "FR1", title: "Public key infrastructure certificates", summary: "Operate PKI to a defined standard where certificates are used." },
  { id: "SR 1.9", part: "62443-3-3", fr: "FR1", title: "Strength of public key authentication", summary: "Ensure public key authentication is cryptographically adequate." },
  { id: "SR 1.10", part: "62443-3-3", fr: "FR1", title: "Authenticator feedback", summary: "Obscure authentication feedback to prevent credential exposure." },
  { id: "SR 1.11", part: "62443-3-3", fr: "FR1", title: "Unsuccessful login attempts", summary: "Limit and respond to repeated failed authentication attempts." },
  { id: "SR 1.12", part: "62443-3-3", fr: "FR1", title: "System use notification", summary: "Display a system use notification before granting access." },
  { id: "SR 1.13", part: "62443-3-3", fr: "FR1", title: "Access via untrusted networks", summary: "Monitor and control access originating from untrusted networks." },

  // FR2 — Use Control
  { id: "SR 2.1", part: "62443-3-3", fr: "FR2", title: "Authorization enforcement", summary: "Enforce least-privilege authorisation for all authenticated entities." },
  { id: "SR 2.2", part: "62443-3-3", fr: "FR2", title: "Wireless use control", summary: "Restrict what authorised wireless users and devices may do." },
  { id: "SR 2.3", part: "62443-3-3", fr: "FR2", title: "Use control for portable and mobile devices", summary: "Control the use of portable and mobile devices in the control environment." },
  { id: "SR 2.4", part: "62443-3-3", fr: "FR2", title: "Mobile code", summary: "Restrict and verify mobile code execution." },
  { id: "SR 2.5", part: "62443-3-3", fr: "FR2", title: "Session lock", summary: "Lock sessions after inactivity." },
  { id: "SR 2.6", part: "62443-3-3", fr: "FR2", title: "Remote session termination", summary: "Terminate remote sessions on inactivity or demand." },
  { id: "SR 2.7", part: "62443-3-3", fr: "FR2", title: "Concurrent session control", summary: "Limit concurrent sessions per account." },
  { id: "SR 2.8", part: "62443-3-3", fr: "FR2", title: "Auditable events", summary: "Generate audit records for security-relevant events." },
  { id: "SR 2.9", part: "62443-3-3", fr: "FR2", title: "Audit storage capacity", summary: "Provision enough audit storage to meet retention needs." },
  { id: "SR 2.10", part: "62443-3-3", fr: "FR2", title: "Response to audit processing failures", summary: "Detect and respond to failures in the audit mechanism itself." },
  { id: "SR 2.11", part: "62443-3-3", fr: "FR2", title: "Timestamps", summary: "Provide reliable, synchronised timestamps for audit records." },
  { id: "SR 2.12", part: "62443-3-3", fr: "FR2", title: "Non-repudiation", summary: "Ensure actions can be attributed to the entity that performed them." },

  // FR3 — System Integrity
  { id: "SR 3.1", part: "62443-3-3", fr: "FR3", title: "Communication integrity", summary: "Protect the integrity of information in transit." },
  { id: "SR 3.2", part: "62443-3-3", fr: "FR3", title: "Malicious code protection", summary: "Detect, prevent and mitigate malicious code." },
  { id: "SR 3.3", part: "62443-3-3", fr: "FR3", title: "Security functionality verification", summary: "Verify that security functions operate correctly." },
  { id: "SR 3.4", part: "62443-3-3", fr: "FR3", title: "Software and information integrity", summary: "Detect unauthorised change to software and information at rest." },
  { id: "SR 3.5", part: "62443-3-3", fr: "FR3", title: "Input validation", summary: "Validate inputs to the control system." },
  { id: "SR 3.6", part: "62443-3-3", fr: "FR3", title: "Deterministic output", summary: "Set outputs to a predetermined safe state on failure." },
  { id: "SR 3.7", part: "62443-3-3", fr: "FR3", title: "Error handling", summary: "Handle errors without disclosing information useful to an attacker." },
  { id: "SR 3.8", part: "62443-3-3", fr: "FR3", title: "Session integrity", summary: "Protect sessions against hijacking and injection." },
  { id: "SR 3.9", part: "62443-3-3", fr: "FR3", title: "Protection of audit information", summary: "Protect audit records and tooling from unauthorised change or deletion." },

  // FR4 — Data Confidentiality
  { id: "SR 4.1", part: "62443-3-3", fr: "FR4", title: "Information confidentiality", summary: "Protect confidentiality of information at rest and in transit." },
  { id: "SR 4.2", part: "62443-3-3", fr: "FR4", title: "Information persistence", summary: "Ensure information does not persist beyond its intended life." },
  { id: "SR 4.3", part: "62443-3-3", fr: "FR4", title: "Use of cryptography", summary: "Use cryptography according to recognised practice and manage keys properly." },

  // FR5 — Restricted Data Flow
  { id: "SR 5.1", part: "62443-3-3", fr: "FR5", title: "Network segmentation", summary: "Segment the control system into zones logically and/or physically." },
  { id: "SR 5.2", part: "62443-3-3", fr: "FR5", title: "Zone boundary protection", summary: "Control and monitor traffic crossing zone boundaries via conduits." },
  { id: "SR 5.3", part: "62443-3-3", fr: "FR5", title: "General purpose person-to-person communication restrictions", summary: "Restrict general-purpose messaging into the control environment." },
  { id: "SR 5.4", part: "62443-3-3", fr: "FR5", title: "Application partitioning", summary: "Separate critical from non-critical applications." },

  // FR6 — Timely Response to Events
  { id: "SR 6.1", part: "62443-3-3", fr: "FR6", title: "Audit log accessibility", summary: "Make audit logs readable and available to authorised personnel and tools." },
  { id: "SR 6.2", part: "62443-3-3", fr: "FR6", title: "Continuous monitoring", summary: "Continuously monitor for security events and performance anomalies." },

  // FR7 — Resource Availability
  { id: "SR 7.1", part: "62443-3-3", fr: "FR7", title: "Denial of service protection", summary: "Operate in a degraded mode rather than fail under DoS conditions." },
  { id: "SR 7.2", part: "62443-3-3", fr: "FR7", title: "Resource management", summary: "Prevent resource exhaustion from affecting essential functions." },
  { id: "SR 7.3", part: "62443-3-3", fr: "FR7", title: "Control system backup", summary: "Back up the control system without affecting operation." },
  { id: "SR 7.4", part: "62443-3-3", fr: "FR7", title: "Control system recovery and reconstitution", summary: "Recover and reconstitute the control system to a known secure state." },
  { id: "SR 7.5", part: "62443-3-3", fr: "FR7", title: "Emergency power", summary: "Maintain or safely shut down on loss of primary power." },
  { id: "SR 7.6", part: "62443-3-3", fr: "FR7", title: "Network and security configuration settings", summary: "Operate to a defined, auditable configuration baseline." },
  { id: "SR 7.7", part: "62443-3-3", fr: "FR7", title: "Least functionality", summary: "Restrict the system to the functions actually required." },
  { id: "SR 7.8", part: "62443-3-3", fr: "FR7", title: "Control system component inventory", summary: "Maintain an accurate inventory of control system components." },
];

/* ── 62443-4-2 — Component Requirements ───────────────────────────────── */
/* CRs mirror the SRs at component level; the device-specific families are    */
/* EDR (embedded), HDR (host), NDR (network) and SAR (software application). */

export const componentRequirements: Requirement[] = [
  { id: "CR 1.1", part: "62443-4-2", fr: "FR1", title: "Human user identification and authentication", summary: "Component-level identification and authentication of human users." },
  { id: "CR 1.2", part: "62443-4-2", fr: "FR1", title: "Software process and device identification and authentication", summary: "Component authenticates software processes and devices." },
  { id: "CR 1.5", part: "62443-4-2", fr: "FR1", title: "Authenticator management", summary: "Component supports secure credential management and change of defaults." },
  { id: "CR 1.7", part: "62443-4-2", fr: "FR1", title: "Strength of password-based authentication", summary: "Component enforces password strength policy." },
  { id: "CR 1.9", part: "62443-4-2", fr: "FR1", title: "Strength of public key authentication", summary: "Component supports adequate public key authentication." },
  { id: "CR 1.14", part: "62443-4-2", fr: "FR1", title: "Strength of symmetric key authentication", summary: "Component supports adequate symmetric key authentication." },
  { id: "NDR 1.6", part: "62443-4-2", fr: "FR1", title: "Wireless access management", summary: "Network device manages and authenticates wireless access." },
  { id: "NDR 1.13", part: "62443-4-2", fr: "FR1", title: "Access via untrusted networks", summary: "Network device controls access arriving from untrusted networks." },

  { id: "CR 2.1", part: "62443-4-2", fr: "FR2", title: "Authorization enforcement", summary: "Component enforces least-privilege authorisation." },
  { id: "CR 2.5", part: "62443-4-2", fr: "FR2", title: "Session lock", summary: "Component locks sessions after inactivity." },
  { id: "CR 2.8", part: "62443-4-2", fr: "FR2", title: "Auditable events", summary: "Component generates audit records for security events." },
  { id: "CR 2.9", part: "62443-4-2", fr: "FR2", title: "Audit storage capacity", summary: "Component provides adequate audit storage." },
  { id: "CR 2.11", part: "62443-4-2", fr: "FR2", title: "Timestamps", summary: "Component provides reliable timestamps." },
  { id: "CR 2.12", part: "62443-4-2", fr: "FR2", title: "Non-repudiation", summary: "Component supports attribution of actions." },
  { id: "CR 2.13", part: "62443-4-2", fr: "FR2", title: "Use of physical diagnostic and test interfaces", summary: "Physical diagnostic/test interfaces are protected against misuse." },

  { id: "CR 3.1", part: "62443-4-2", fr: "FR3", title: "Communication integrity", summary: "Component protects integrity of transmitted information." },
  { id: "CR 3.2", part: "62443-4-2", fr: "FR3", title: "Protection from malicious code", summary: "Component protects itself against malicious code." },
  { id: "CR 3.4", part: "62443-4-2", fr: "FR3", title: "Software and information integrity", summary: "Component detects unauthorised change to its software and data." },
  { id: "CR 3.5", part: "62443-4-2", fr: "FR3", title: "Input validation", summary: "Component validates its inputs." },
  { id: "CR 3.7", part: "62443-4-2", fr: "FR3", title: "Error handling", summary: "Component handles errors safely." },
  { id: "CR 3.9", part: "62443-4-2", fr: "FR3", title: "Protection of audit information", summary: "Component protects its audit records." },
  { id: "CR 3.10", part: "62443-4-2", fr: "FR3", title: "Support for updates", summary: "Component supports authenticated, verifiable security updates." },
  { id: "CR 3.11", part: "62443-4-2", fr: "FR3", title: "Physical tamper resistance and detection", summary: "Component resists and/or detects physical tampering." },
  { id: "CR 3.12", part: "62443-4-2", fr: "FR3", title: "Provisioning product supplier roots of trust", summary: "Component supports supplier root-of-trust provisioning." },
  { id: "CR 3.13", part: "62443-4-2", fr: "FR3", title: "Provisioning asset owner roots of trust", summary: "Component supports asset-owner root-of-trust provisioning." },
  { id: "CR 3.14", part: "62443-4-2", fr: "FR3", title: "Integrity of the boot process", summary: "Component verifies integrity of its boot process." },

  { id: "CR 4.1", part: "62443-4-2", fr: "FR4", title: "Information confidentiality", summary: "Component protects confidentiality of information it holds or sends." },
  { id: "CR 4.2", part: "62443-4-2", fr: "FR4", title: "Information persistence", summary: "Component supports erasure of information no longer needed." },
  { id: "CR 4.3", part: "62443-4-2", fr: "FR4", title: "Use of cryptography", summary: "Component uses cryptography to recognised practice." },

  { id: "NDR 5.2", part: "62443-4-2", fr: "FR5", title: "Zone boundary protection", summary: "Network device enforces zone boundary controls." },
  { id: "NDR 5.3", part: "62443-4-2", fr: "FR5", title: "General purpose person-to-person communication restrictions", summary: "Network device restricts general-purpose messaging across boundaries." },

  { id: "CR 6.1", part: "62443-4-2", fr: "FR6", title: "Audit log accessibility", summary: "Component makes its audit logs accessible." },
  { id: "CR 6.2", part: "62443-4-2", fr: "FR6", title: "Continuous monitoring", summary: "Component supports continuous security monitoring." },

  { id: "CR 7.1", part: "62443-4-2", fr: "FR7", title: "Denial of service protection", summary: "Component degrades gracefully under DoS." },
  { id: "CR 7.2", part: "62443-4-2", fr: "FR7", title: "Resource management", summary: "Component manages its resources to protect essential functions." },
  { id: "CR 7.3", part: "62443-4-2", fr: "FR7", title: "Control system backup", summary: "Component supports backup of its configuration and data." },
  { id: "CR 7.4", part: "62443-4-2", fr: "FR7", title: "Control system recovery and reconstitution", summary: "Component supports recovery to a known secure state." },
  { id: "CR 7.6", part: "62443-4-2", fr: "FR7", title: "Network and security configuration settings", summary: "Component configuration is auditable against a baseline." },
  { id: "CR 7.7", part: "62443-4-2", fr: "FR7", title: "Least functionality", summary: "Component allows unnecessary functions to be disabled." },
  { id: "CR 7.8", part: "62443-4-2", fr: "FR7", title: "Control system component inventory", summary: "Component reports inventory information." },
];

/* ── 62443-2-1 / 2-4 / 3-2 / 4-1 — programme and lifecycle ────────────── */

export const programmeRequirements: Requirement[] = [
  { id: "62443-2-1: CSMS", part: "62443-2-1", title: "Cyber security management system", summary: "Establish and operate an IACS security programme covering organisation, risk, and controls." },
  { id: "62443-2-1: Org & Policy", part: "62443-2-1", title: "Organisational security policies and accountability", summary: "Assign accountability and maintain IACS security policy at organisational level." },
  { id: "62443-2-1: Risk", part: "62443-2-1", title: "Risk identification, classification and assessment", summary: "Identify and assess risk to the IACS on a defined cycle." },
  { id: "62443-2-1: Training", part: "62443-2-1", title: "Personnel security, training and awareness", summary: "Train and vet personnel with IACS security responsibilities." },
  { id: "62443-2-1: Incident", part: "62443-2-1", title: "Incident planning and response", summary: "Plan for, respond to and learn from IACS security incidents." },
  { id: "62443-2-1: Continuity", part: "62443-2-1", title: "Business continuity and disaster recovery", summary: "Maintain continuity and recovery arrangements for the IACS." },
  { id: "62443-2-1: Conformance", part: "62443-2-1", title: "Conformance and review", summary: "Audit and review the security programme for effectiveness." },

  { id: "62443-2-4: SP", part: "62443-2-4", title: "Service provider security programme requirements", summary: "Security capability requirements placed on IACS integration and maintenance providers." },

  { id: "ZCR 1", part: "62443-3-2", title: "Identify the System under Consideration", summary: "Define the boundary of the system being assessed." },
  { id: "ZCR 2", part: "62443-3-2", title: "Initial cyber security risk assessment", summary: "Perform a high-level risk assessment of the SuC." },
  { id: "ZCR 3", part: "62443-3-2", title: "Partition the SuC into zones and conduits", summary: "Divide the system into zones and conduits on risk grounds." },
  { id: "ZCR 4", part: "62443-3-2", title: "Risk comparison against tolerable risk", summary: "Compare assessed risk with the organisation's tolerable risk." },
  { id: "ZCR 5", part: "62443-3-2", title: "Detailed cyber security risk assessment", summary: "Assess residual risk per zone and conduit and set target SLs." },
  { id: "ZCR 6", part: "62443-3-2", title: "Documentation of cyber security requirements", summary: "Record requirements, assumptions and constraints (the CRS)." },
  { id: "ZCR 7", part: "62443-3-2", title: "Asset owner approval", summary: "Asset owner formally approves the risk assessment outcome." },

  { id: "62443-4-1: SM", part: "62443-4-1", title: "Security management", summary: "Development organisation runs a defined secure development process." },
  { id: "62443-4-1: SR", part: "62443-4-1", title: "Specification of security requirements", summary: "Product security requirements are specified and traceable." },
  { id: "62443-4-1: SD", part: "62443-4-1", title: "Secure by design", summary: "Threat modelling and defence in depth applied at design time." },
  { id: "62443-4-1: SI", part: "62443-4-1", title: "Secure implementation", summary: "Secure coding standards applied and reviewed." },
  { id: "62443-4-1: SVV", part: "62443-4-1", title: "Security verification and validation testing", summary: "Security testing performed before release." },
  { id: "62443-4-1: DM", part: "62443-4-1", title: "Management of security-related issues", summary: "Vulnerabilities reported, triaged and remediated." },
  { id: "62443-4-1: SUM", part: "62443-4-1", title: "Security update management", summary: "Security patches produced, tested and delivered." },
  { id: "62443-4-1: SG", part: "62443-4-1", title: "Security guidelines", summary: "Hardening and secure-use documentation supplied to the asset owner." },
];

export const allRequirements: Requirement[] = [
  ...systemRequirements,
  ...componentRequirements,
  ...programmeRequirements,
];

export const requirementById = Object.fromEntries(allRequirements.map((r) => [r.id, r]));

/** Security levels defined in 62443-3-3. */
export const securityLevels = [
  { id: "SL 1", name: "Protection against casual or coincidental violation" },
  { id: "SL 2", name: "Protection against intentional violation using simple means" },
  { id: "SL 3", name: "Protection against intentional violation using sophisticated means" },
  { id: "SL 4", name: "Protection against intentional violation using sophisticated means with extended resources" },
];
