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

    let data = {};

    if(type === 'test'){
      data = {
          from: serverEmail,
          to: clientEmail,
          subject: 'Test',
          text: 'this is a test email'
      }
    }

    transporter.sendMail(data , function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
  }
