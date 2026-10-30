import type { User } from "@prisma/client";

// Fields a full self-registration always collects. Bulk-imported members
// only require studentId/surname/firstName, so any of these (email
// included) can be missing until the member fills them in on first login.
export function isProfileIncomplete(user: User): boolean {
  return (
    !user.email ||
    !user.dateOfBirth ||
    !user.sex ||
    !user.occupation ||
    !user.faculty ||
    !user.program ||
    !user.level ||
    !user.constituency ||
    user.hasVotersId === null ||
    !user.whatsapp ||
    !user.phone ||
    !user.signature
  );
}
