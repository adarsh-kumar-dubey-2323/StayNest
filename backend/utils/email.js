import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error("Email service is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS.");
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
};

export const sendVerificationEmail = async ({ name, email, token }) => {
  const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
  const verificationUrl = frontendUrl + "/verify-email?token=" + encodeURIComponent(token) + "&email=" + encodeURIComponent(email);
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  await getTransporter().sendMail({
    from: `StayNest <${from}>`,
    to: email,
    subject: "Verify your StayNest email address",
    text: `Hi ${name}, verify your StayNest account using this link (valid for 30 minutes): ${verificationUrl}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px;color:#1f2937"><h2 style="color:#4f46e5">Welcome to StayNest!</h2><p>Hi ${name},</p><p>Please verify your email address to activate your account.</p><p style="margin:28px 0"><a href="${verificationUrl}" style="background:#4f46e5;color:#fff;padding:14px 22px;border-radius:8px;text-decoration:none;font-weight:600">Verify my email</a></p><p>This link expires in 30 minutes. If you did not create a StayNest account, you can ignore this email.</p><p>StayNest Team</p></div>`,
  });
};
