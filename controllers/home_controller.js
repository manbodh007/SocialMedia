
const Post = require('../models/post');
const User = require('../models/user');
const Token = require('../models/resetPassToken');
const crypto = require('crypto');

const resetPasswordMailer = require('../mailers/resetPassword_mail');


module.exports.home = function(req,res){
    if(req.isAuthenticated()){
        req.flash('success','your are already logged in');
        return res.redirect('/users/timeline');
    }
    return res.render('home');
}


    module.exports.resetPasswordEmail = function(req,res){
        return res.render('resetPasswordEmail');
    }

    module.exports.resetPassLink = async function(req,res){
        try{
            let user =  await User.findOne({email:req.body.email});
            
            if(user){
                req.flash('success','link is send to your email');
                let accessToken = await Token.create({
                    user:user._id,
                    accessToken:crypto.randomBytes(20).toString('hex'),
                    isValid:true,
                });
                // let token = AccessToken.findById(accessToken._id).populate('user');
                 accessToken =  await accessToken.populate('user').execPopulate();
                 resetPasswordMailer.resetPassLink(accessToken);
                console.log(accessToken.user);
               return res.redirect('back');
            }else{
                req.flash('error','email is not registered');
                return res.redirect('back');
            }
        }catch(error){
            if(error){
                console.log('error in sending forget password link',error);
                return;
            }
        }
    }

    module.exports.resetPassword = async function(req,res){
        try{
            let token = await Token.findOne({accessToken:req.params.token});
            if(token.isValid){
                if(req.body.password==req.body.conformPassword){
                    let user = await User.findById(token.user);
                  user.password = req.body.password,
                  token.isValid = false;
                  token.save();
                  user.save();
                  req.flash('success','password update successfully');
                  
                  return res.redirect('/');
                }else{
                    req.flash('error','conform password does not match')
                    return res.redirect('back');
                }
            }else{
                req.flash('error','link expired!!!');
                return res.redirect('/reset-password');
            }

        }catch(error){
             console.log('error in reset password',error);
        }
    }
     
   

