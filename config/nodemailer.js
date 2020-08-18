const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const env = require('./environment');

let transport = nodemailer.createTransport(env.smtp);

let renderTemplate = (data,relativePath)=>{
  let mailHTML;
  ejs.renderFile(
    path.join(__dirname,'../views/mailers',relativePath),
    data,
    function(error,template){
      if(error){
        console.log('error in rendering mail',error);
        return;
      }
      mailHTML = template;
    }
  )
  return mailHTML;
}

module.exports = {
  transport:transport,
  renderTemplate:renderTemplate,
}