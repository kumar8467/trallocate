var nodemailer = require('nodemailer');
var Promise = require('promise');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'testing8467@gmail.com',
    pass: 'pointerpointer'
  }
});

exports.sendEmail = function(options) {
	return new Promise(function(resolve, reject){
		if (options.to && options.html && options.subject) {
	    options.from = 'testing8467@gmail.com';
	    return transporter.sendMail(options, function(error, info) {
	      if (error) {
	        return reject(error);
	      } else {
	      	console.log('Message sent: ' + info.response);
	      	return resolve(info);
	      }
	    });
	  }
	});
};
