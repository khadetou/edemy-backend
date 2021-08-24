import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";

const _dirname = path.resolve();
const templatePath = fs.readFileSync(
  path.join(_dirname, "/views/reset.hbs"),
  "utf8"
);
const template = handlebars.compile(templatePath);

export default async function sendEMail(options) {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM_NAME,
    SMTP_FROM_EMAIL,
  } = process.env;

  let transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b35967b3b5d728",
      pass: "47ea213e6c6a59",
    },
  });
  const message = {
    from: '"EDEMY" <noreply@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: "Reset Password",
    html: template({ url: options.resetUrl }),
  };

  await transport.sendMail(message);
}
