import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (email: string, name: string) => {
  await transporter.sendMail({
    from: `"Learni AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Learni AI 🚀",
    html: `
      <div style="font-family: Arial; background:#0f172a; color:white; padding:40px;">
        <h1 style="color:#22d3ee;">Welcome to Learni AI, ${name} 👋</h1>
        <p style="font-size:16px; line-height:1.7;">
          Your AI language journey has started.
        </p>
        <p style="font-size:16px; line-height:1.7;">
          Learni AI will help you improve speaking, pronunciation,
          grammar, confidence, and real conversations with your personal AI teacher.
        </p>
        <p style="margin-top:40px; color:#94a3b8;">
          Learni AI Team
        </p>
      </div>
    `,
  });
};

export const sendResetPasswordEmail = async (
  email: string,
  resetLink: string
) => {
  await transporter.sendMail({
    from: `"Learni AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your Learni AI password",
    html: `
      <div style="font-family: Arial; background:#0f172a; color:white; padding:40px;">
        <h1 style="color:#22d3ee;">Reset your password 🔐</h1>
        <p style="font-size:16px; line-height:1.7;">
          We received a request to reset your password.
        </p>
        <div style="margin-top:30px;">
          <a
            href="${resetLink}"
            style="background:#22d3ee;color:#020617;padding:14px 24px;border-radius:12px;text-decoration:none;font-weight:bold;"
          >
            Reset Password
          </a>
        </div>
        <p style="margin-top:30px; color:#94a3b8;">
          This link expires in 1 hour.
        </p>
      </div>
    `,
  });
};