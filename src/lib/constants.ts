export const ROLES = ["MEMBER", "EXECUTIVE", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const ELECTION_STATUSES = ["DRAFT", "OPEN", "CLOSED"] as const;
export type ElectionStatus = (typeof ELECTION_STATUSES)[number];

export const REQUEST_TYPES = ["QUERY", "SUGGESTION", "REQUEST"] as const;
export type RequestType = (typeof REQUEST_TYPES)[number];

export const REQUEST_STATUSES = ["PENDING", "IN_REVIEW", "RESOLVED"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const ORG_NAME = "TEIN-KUC & NDC";
export const ORG_FULL_NAME =
  "Tertiary Education Institutions Network — Koforidua University College (in collaboration with the NDC)";
