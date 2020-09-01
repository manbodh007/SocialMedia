const nodeMailer = require("../config/nodemailer");
const { deserializeUser } = require("passport");

exports.link = (user) => {
  console.log("inside nodemailer");
  let htmlString = nodeMailer.renderTemplate(
    { user: user },
    "/links/email_confirm.ejs"
  );

  nodeMailer.transport.sendMail(
    {
      from: "Eroschat",
      to: user.email,
      subject: "email verification",
      html: htmlString,
    },
    (error, info) => {
      if (error) {
        console.log("error in email sending", error);
        return;
      }
      console.log("email information", info);
    }
  );
};
