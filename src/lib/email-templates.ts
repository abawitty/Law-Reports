const WRAPPER_START = `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; color: #1f2937;">
  <div style="background: linear-gradient(135deg, #024a27, #046a38); padding: 20px 24px; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; font-size: 18px; margin: 0;">TEIN-KUC</h1>
  </div>
  <div style="border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; padding: 24px;">
`;
const WRAPPER_END = `
  </div>
  <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">
    TEIN-KUC — Tertiary Education Institutions Network, Kings University College
  </p>
</div>
`;

export function approvalEmail(fullName: string, membershipNumber: string, loginUrl: string) {
  return {
    subject: "Your TEIN-KUC membership application has been approved",
    html: `${WRAPPER_START}
      <p>Dear ${fullName},</p>
      <p>Congratulations — your TEIN-KUC membership application has been <strong style="color:#046a38;">approved</strong>.</p>
      <p>Your official membership number is:</p>
      <p style="font-size: 20px; font-weight: bold; letter-spacing: 1px; background: #f0fdf4; color: #024a27; padding: 10px 14px; border-radius: 6px; display: inline-block;">
        ${membershipNumber}
      </p>
      <p>Log in to your member dashboard with your existing Member ID and password at
        <a href="${loginUrl}" style="color: #046a38;">${loginUrl}</a>.
      </p>
      <p>Welcome to TEIN-KUC.</p>
    ${WRAPPER_END}`,
  };
}

export function importWelcomeEmail(
  fullName: string,
  memberId: string,
  membershipNumber: string | null,
  tempPassword: string,
  loginUrl: string,
) {
  return {
    subject: "Your TEIN-KUC member account has been created",
    html: `${WRAPPER_START}
      <p>Dear ${fullName},</p>
      <p>A TEIN-KUC member account has been created for you. Your login details are:</p>
      <table style="margin: 12px 0; font-size: 14px;">
        <tr><td style="color:#6b7280; padding: 4px 12px 4px 0;">Member ID</td><td style="font-weight:bold;">${memberId}</td></tr>
        ${membershipNumber ? `<tr><td style="color:#6b7280; padding: 4px 12px 4px 0;">Membership No.</td><td style="font-weight:bold;">${membershipNumber}</td></tr>` : ""}
        <tr><td style="color:#6b7280; padding: 4px 12px 4px 0;">Temporary Password</td><td style="font-weight:bold;">${tempPassword}</td></tr>
      </table>
      <p>Log in at <a href="${loginUrl}" style="color: #046a38;">${loginUrl}</a> with the details above.
        You'll be asked to set your own password the first time you log in.
      </p>
      <p>Welcome to TEIN-KUC.</p>
    ${WRAPPER_END}`,
  };
}
