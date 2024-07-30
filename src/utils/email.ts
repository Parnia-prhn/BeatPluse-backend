import nodemailer from "nodemailer";

export async function sendOtpEmail(to: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email details
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Your verification code - beat+",
    text: `Your verification code is ${otp}. It will expire in 10 minutes.`,
  };

  // Send email
  await transporter.sendMail(mailOptions);
}
