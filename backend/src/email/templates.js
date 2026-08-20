import { emailLayout } from "./layout.js";

export function statusEmail({
  applicantName,
  status,
  applicationId,
  appAdminId,
  remarks,
}) {
  const statusText = {
    APPROVED: "Good news! Your application has been approved.",
    REJECTED:
      "Your application was not approved. Please check your portal for details.",
  };
  return {
    subject: "Application status update",
    html: emailLayout({
      title: "Application Status Update",
      bodyHtml: `<p>Hi ${applicantName},</p><p>${statusText[status]}</p><p>Application ID: ${applicationId}</p><p>Remarks by: ${appAdminId}</p><p>Remarks: ${remarks}</p>`,
    }),
  };
}

export function verifyEmail({ applicantName, verifyUrl }) {
  return {
    subject: "Confirm your email",
    html: emailLayout({
      title: "Confirm Your Email",
      bodyHtml: `<p>Hi ${applicantName},</p><p>Click below to confirm your email address.</p><a href="${verifyUrl}">Confirm Email</a>`,
    }),
  };
}

export function resetPasswordEmail({ applicantName, resetUrl }) {
  return {
    subject: "Reset your password",
    html: emailLayout({
      title: "Reset Your Password",
      bodyHtml: `<p>Hi ${applicantName},</p><p>Click below to reset your password. This link expires in 1 hour.</p><a href="${resetUrl}">Reset Password</a>`,
    }),
  };
}

export function passwordChangedEmail({ applicantName }) {
  return {
    subject: "Your password was changed",
    html: emailLayout({
      title: "Password Changed",
      bodyHtml: `<p>Hi ${applicantName},</p><p>Your password was just changed. If this wasn't you, contact support immediately.</p>`,
    }),
  };
}
