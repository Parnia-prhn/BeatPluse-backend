import nodemailer from "nodemailer";

export async function sendOtpEmail(to: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "your-email-provider", // e.g., 'gmail'
    auth: {
      user: "your-email@example.com",
      pass: "your-email-password",
    },
  });

  // Email details
  const mailOptions = {
    from: "your-email@example.com",
    to,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
  };

  // Send email
  await transporter.sendMail(mailOptions);
}
