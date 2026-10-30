import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasAdminPortalAccess } from "@/lib/constants";

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
