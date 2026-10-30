export const ROLES = ["MEMBER", "SECRETARY", "VICE_PRESIDENT", "PRESIDENT", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const EXECUTIVE_ROLES: Role[] = ["SECRETARY", "VICE_PRESIDENT", "PRESIDENT", "ADMIN"];

export const ROLE_LABELS: Record<Role, string> = {
  MEMBER: "Member",
  SECRETARY: "General Secretary",
  VICE_PRESIDENT: "Vice President",
  PRESIDENT: "President",
  ADMIN: "Admin",
};

// These take `string` rather than `Role` because the caller is sometimes a
// typed session role and sometimes a plain `role` column straight off a
// Prisma query (the role column is a plain String, not a native enum — see
// the schema comment on User.role).

// Any of these roles can open the Admin Portal at all.
export function hasAdminPortalAccess(role: string): boolean {
  return role !== "MEMBER";
}

// Can mark a pending application as reviewed, pending the President's
// final sign-off. The President/Admin can also do this (see
// canGiveFinalApproval) — they don't need to go through the partial step.
export function canPartiallyApprove(role: string): boolean {
  return role === "VICE_PRESIDENT" || role === "PRESIDENT" || role === "ADMIN";
}

// Only the President (or the technical Admin account) can give final
// approval — the step that actually assigns a membership number.
export function canGiveFinalApproval(role: string): boolean {
  return role === "PRESIDENT" || role === "ADMIN";
}

// Resetting a member's password and resending their emails — handling
// member credentials — is reserved for the General Secretary and the
// President/Admin.
export function canManageMemberCredentials(role: string): boolean {
  return role === "SECRETARY" || role === "PRESIDENT" || role === "ADMIN";
}

// Creating new executive (officer) accounts is reserved for the President
// and the technical Admin account.
export function canManageExecutiveAccounts(role: string): boolean {
  return role === "PRESIDENT" || role === "ADMIN";
}

export const ELECTION_STATUSES = ["DRAFT", "OPEN", "CLOSED"] as const;
export type ElectionStatus = (typeof ELECTION_STATUSES)[number];

export const REQUEST_TYPES = ["QUERY", "SUGGESTION", "REQUEST"] as const;
export type RequestType = (typeof REQUEST_TYPES)[number];

export const REQUEST_STATUSES = ["PENDING", "IN_REVIEW", "RESOLVED"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const ORG_NAME = "TEIN-KUC & NDC";
export const ORG_FULL_NAME =
  "Tertiary Education Institutions Network — Kings University College (in collaboration with the NDC)";
