const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendEmail(toEmail) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Trufflehog Vulnerabilities Report',
    text: 'Here is the Trufflehog report for your last push.',
    attachments: [
      {
        filename: 'trufflehog-report.pdf',
        path: './trufflehog-report.pdf'
      }
    ]
  };

  let info = await transporter.sendMail(mailOptions);
  console.log('Email sent: ' + info.response);
}

const execSync = require('child_process').execSync;
const authorEmail = execSync('git log -1 --pretty=format:"%ae"').toString().trim();

sendEmail(authorEmail);