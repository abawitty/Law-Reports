// Plain-text SMS copy — short and fixed in code (unlike the admin-editable
// email templates in src/lib/email-templates.ts) since every extra
// character costs money per SMS segment.

export function approvalSms(membershipNumber: string, loginUrl: string): string {
  return `TEIN-KUC: Your membership has been approved. Membership No: ${membershipNumber}. Log in at ${loginUrl}`;
}

export function credentialsSms(
  studentId: string,
  membershipNumber: string | null,
  tempPassword: string,
  loginUrl: string,
): string {
  const numberPart = membershipNumber ? ` Membership No: ${membershipNumber}.` : "";
  return `TEIN-KUC: Member ID: ${studentId}.${numberPart} Temp password: ${tempPassword}. Log in at ${loginUrl} and set a new password.`;
}
