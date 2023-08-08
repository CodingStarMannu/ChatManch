const nodeMailer = require('../config/nodemailer');

// this is the another way of exporting a method
exports.resetPassword = async (user) => {
  try {
    const htmlString = nodeMailer.renderTemplate({ user: user }, '/users/password_reset.ejs');
    console.log('Inside resetPassword Mailer');

    await nodeMailer.transporter.sendMail({
      from: 'manojpant097@gmail.com',
      to: user.email,
      subject: 'Reset Your Password',
      html: htmlString,
    });

    console.log('Email sent successfully');
  } catch (err) {
    console.log('Error in sending mail', err);
    throw err; // Rethrow the error to handle it further if needed
  }
};
