import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { canAccessGeneralAdminTools, hasAdminPortalAccess } from "@/lib/constants";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/membership/login");
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!hasAdminPortalAccess(user.role)) redirect("/dashboard");
  return user;
}

// For pages open to Admin Portal users in general, but not to the Electoral
// Commissioner — whose access is scoped to members and elections only.
export async function requireGeneralAdmin() {
  const user = await requireAdmin();
  if (!canAccessGeneralAdminTools(user.role)) redirect("/dashboard/admin");
  return user;
}
