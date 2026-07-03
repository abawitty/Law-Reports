import { prisma } from "@/lib/prisma";

const FALLBACK = "TEIN-0001";

function splitNumber(value: string): { prefix: string; digits: string } | null {
  const match = value.match(/^(.*?)(\d+)$/);
  if (!match) return null;
  return { prefix: match[1], digits: match[2] };
}

// Continues whatever numbering pattern already exists among assigned
// membership numbers: same prefix as the most common one in use, next
// integer after the current max within that prefix, zero-padded to match.
export async function computeNextMembershipNumber(): Promise<string> {
  const rows = await prisma.user.findMany({
    where: { membershipNumber: { not: null } },
    select: { membershipNumber: true },
  });

  const parsed = rows
    .map((r) => (r.membershipNumber ? splitNumber(r.membershipNumber) : null))
    .filter((p): p is { prefix: string; digits: string } => p !== null);

  if (parsed.length === 0) return FALLBACK;

  const prefixCounts = new Map<string, number>();
  for (const p of parsed) {
    prefixCounts.set(p.prefix, (prefixCounts.get(p.prefix) ?? 0) + 1);
  }
  const bestPrefix = [...prefixCounts.entries()].sort((a, b) => b[1] - a[1])[0][0];

  const inGroup = parsed.filter((p) => p.prefix === bestPrefix);
  const maxValue = Math.max(...inGroup.map((p) => parseInt(p.digits, 10)));
  const width = Math.max(...inGroup.map((p) => p.digits.length));
  const next = maxValue + 1;

  return `${bestPrefix}${String(next).padStart(width, "0")}`;
}
