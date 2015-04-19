var nodemailer, transporter;

nodemailer = require('nodemailer');

transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'testing8467@gmail.com',
    pass: 'pointerpointer'
  }
});

exports.sendEmail = function(options) {
  if (options.to && options.html && options.subject) {
    options.from = 'testing8467@gmail.com';
    return transporter.sendMail(options, function(error, info) {
      if (error) {
        return console.log(error);
      } else {
        return console.log('Message sent: ' + info.response);
      }
    });
  }
};
