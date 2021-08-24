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
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
  const message = {
    from: `${SMTP_FROM_NAME}<${SMTP_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: "Reset Password",
    html: template({ url: options.resetUrl }),
  };

  await transport.sendMail(message);
}
