const nodeMailer = require('../config/nodemailer');


exports.newComment = (comment)=>{
    console.log('inside newComment nodeMailer');
    let htmlString = nodeMailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');
    console.log(comment);
    
    nodeMailer.transport.sendMail({
        from:'codeial.com',
        to:comment.user.email,
        subject:'new comment is posted',
        html:htmlString
    },(error,info)=>{
        if(error){
            console.log('error in sending mail',error);
            return;
        }

        console.log("mail is send",info);
        return;
    })
}