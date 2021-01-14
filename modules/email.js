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

  module.exports = function(clientEmail, type, additionalData){

    data = {};

    if(type === 'test'){
      data = {
          from: serverEmail,
          to: clientEmail,
          subject: 'Test',
          text: 'this is a test email'
      }
    }
    else if(type === 'signup'){
      data = {
        from: serverEmail,
        to: clientEmail,
        subject: 'Student Request System - UOM',
        text: 'You have succesfully created an account for the student request system of UOM. \nPlease click on the link below to verify your email address.\nhttp://localhost:3000/verify/'
             + additionalData.id + '\nAfterwards you can log in to the system.'
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
