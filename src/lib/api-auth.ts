import { auth } from "@/lib/auth";
import { hasAdminPortalAccess } from "@/lib/constants";

export async function getAdminSession() {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" as const, status: 401 as const };
  if (!hasAdminPortalAccess(session.user.role)) {
    return { error: "Forbidden" as const, status: 403 as const };
  }
  return { session };
}
