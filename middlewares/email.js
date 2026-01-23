const nodemailer = require('nodemailer');
const { EMAIL_LOGIN, EMAIL_SECRET, EMAIL_HOST } = require('../config');

const sendEmail = (to, subject, text) => {
  // Создаем транспорт для подключения к SMTP
  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: 465,
    secure: true, // использовать SSL
    auth: {
      user: EMAIL_LOGIN,
      pass: EMAIL_SECRET, // или пароль приложения
    },
  });

  // Настройки письма
  const mailOptions = {
    from: EMAIL_LOGIN,
    to: `${to}`,
    subject: `${subject}`,
    text: `${text}`,
  };

  // Отправляем письмо
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return { error };
    }
    console.log(info.messageId);
    return { info };
  });
};

module.exports = {
  sendEmail,
};
