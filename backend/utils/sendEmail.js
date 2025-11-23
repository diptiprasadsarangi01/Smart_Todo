import nodemailer from "nodemailer";

const sendEmail = async (to, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter.sendMail({
    from: `"AI Task Manager" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: message,
  });
};

export default sendEmail;
