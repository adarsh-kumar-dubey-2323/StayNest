const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);

export const sendVerificationEmail = async ({ name, email, token }) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Email service is not configured. Set RESEND_API_KEY in the backend environment.");
  }

  const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
  const verificationUrl =
    frontendUrl +
    "/verify-email?token=" +
    encodeURIComponent(token) +
    "&email=" +
    encodeURIComponent(email);

  // Resend's shared test sender works for testing. For production delivery
  // to arbitrary recipients, configure a sender on a domain verified in Resend.
  const from = process.env.RESEND_FROM || "StayNest <onboarding@resend.dev>";
  const safeName = escapeHtml(name || "there");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Verify your StayNest email address",
      text: `Hi ${name || "there"}, verify your StayNest account using this link (valid for 30 minutes): ${verificationUrl}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px;color:#1f2937"><h2 style="color:#4f46e5">Welcome to StayNest!</h2><p>Hi ${safeName},</p><p>Please verify your email address to activate your account.</p><p style="margin:28px 0"><a href="${verificationUrl}" style="background:#4f46e5;color:#fff;padding:14px 22px;border-radius:8px;text-decoration:none;font-weight:600">Verify my email</a></p><p>This link expires in 30 minutes. If you did not create a StayNest account, you can ignore this email.</p><p>StayNest Team</p></div>`,
    }),
    signal: AbortSignal.timeout(15000),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("Resend API error:", response.status, result);
    throw new Error(result.message || result.error || `Email provider returned HTTP ${response.status}`);
  }

  console.info("StayNest verification email accepted by Resend:", result.id);
  return result;
};
