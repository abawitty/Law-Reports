export const ROLES = [
  "MEMBER",
  "SECRETARY",
  "VICE_PRESIDENT",
  "EC_CHAIRPERSON",
  "PRESIDENT",
  "ADMIN",
] as const;
export type Role = (typeof ROLES)[number];

export const EXECUTIVE_ROLES: Role[] = [
  "SECRETARY",
  "VICE_PRESIDENT",
  "EC_CHAIRPERSON",
  "PRESIDENT",
  "ADMIN",
];

export const ROLE_LABELS: Record<Role, string> = {
  MEMBER: "Member",
  SECRETARY: "General Secretary",
  VICE_PRESIDENT: "Vice President",
  EC_CHAIRPERSON: "Electoral Commissioner",
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

// General admin tools — site content, images, custom pages, the photo
// gallery, and member queries/requests — are open to everyone with Admin
// Portal access except the Electoral Commissioner, whose access is scoped
// to members (for the voters register) and elections only.
export function canAccessGeneralAdminTools(role: string): boolean {
  return hasAdminPortalAccess(role) && role !== "EC_CHAIRPERSON";
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

// Creating new executive (officer) accounts, and deleting/reinstating
// member accounts, is reserved for the President and the technical Admin
// account.
export function canManageExecutiveAccounts(role: string): boolean {
  return role === "PRESIDENT" || role === "ADMIN";
}

// Creating and running elections (positions, candidates, opening/closing
// voting) is reserved for the Electoral Commissioner, appointed by the
// President — plus the President/Admin themselves. The Vice President and
// General Secretary no longer have this by virtue of general admin access.
export function canManageElections(role: string): boolean {
  return role === "EC_CHAIRPERSON" || role === "PRESIDENT" || role === "ADMIN";
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
