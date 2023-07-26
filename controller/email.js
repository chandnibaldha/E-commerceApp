const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const SendEmail = asyncHandler(async (data, req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.forwardemail.net",
    port: 465,
    secure: true,
    auth: {
      user: "REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM",
      pass: "REPLACE-WITH-YOUR-GENERATED-PASSWORD",
    },
  });

  
  async function main() {
    const info = await transporter.sendMail({
      from: '"Hey 👻" <foo@example.com>',
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
    });

    console.log("Message sent: %s", info.messageId);
  }
});

module.exports = SendEmail;
