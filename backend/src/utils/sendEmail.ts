import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: any[];
}

export const sendEmail = async ({
  to,
  subject,
  html,
  attachments,
}: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Barwa Store" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments,
  });
};