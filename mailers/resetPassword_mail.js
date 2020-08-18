const nodeMailer = require('../config/nodemailer');

exports.resetPassLink = (accessToken)=>{
    console.log('inside the reset password mailer');
    let htmlString = nodeMailer.renderTemplate({token:accessToken},'/links/reset_password.ejs');
    nodeMailer.transport.sendMail({
        from:'codeial.com',
        to:accessToken.user.email,
        subject:'reset password',
        html:htmlString
    },(error,info)=>{
        if(error){
            console.log('error in sending reset mail in resetPassword mailer',error);
            return;
        }
        console.log('mail is send',info);
        return;
    })
    console.log(accessToken);
}