import nodemailer from "nodemailer";
import CONFIG from ".";
import SMTPPool from "nodemailer/lib/smtp-pool";

const pool = new SMTPPool();
pool.options.maxConnections = Infinity;

const transporter = nodemailer.createTransport(
  {
    service: "gmail",
    host: "smtp.gmail.com",
    secure: true,
    auth: {
      user: CONFIG.NODEMAILER_EMAIL,
      pass: CONFIG.NODEMAILER_IMAP_PASSWORD,
    },
  },
  { from: `OmiSoft <${CONFIG.NODEMAILER_EMAIL}>` }
);

export const mailer = (message: Object) => {
  transporter.sendMail(message, (error: Error | null) => {
    if (!error) {
      console.log("Email sent successfully");
    } else {
      console.log("The email was not sent: " + error);
    }
  });
};
