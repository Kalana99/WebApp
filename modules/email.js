const nodemailer = require('nodemailer');
const serverEmail = 'uom.studentrequestsystem@gmail.com';
const serverEmailPassword = 'studentRequestSystem1A*';

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: serverEmail,
      pass: serverEmailPassword
    }
  });

  module.exports = function(clientEmail, type){

    let data = {
        from: serverEmail,
        to: clientEmail,
        subject: 'new mail',
        text: 'That was easy!'
    }

    transporter.sendMail(, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
  }
