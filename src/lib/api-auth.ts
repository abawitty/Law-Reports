import { auth } from "@/lib/auth";

export async function getAdminSession() {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" as const, status: 401 as const };
  if (session.user.role !== "ADMIN" && session.user.role !== "EXECUTIVE") {
    return { error: "Forbidden" as const, status: 403 as const };
  }
  return { session };
}
