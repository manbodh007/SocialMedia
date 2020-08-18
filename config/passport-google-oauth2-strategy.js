const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');

// tell passport to use google oauth
passport.use(new googleStrategy({
    clientID:env.google_client_id,
    clientSecret:env.google_client_secret,
    callbackURL:env.google_call_back_url,
},function(accessToken,refreshToken,profile,done){

    // if user google user is also a user of codeial to check that
    User.findOne({email:profile.emails[0].value}).exec(function(err,user){
        if(err){
            console.log('error in google oauth',err);
            return;
        }

        console.log(profile);
       // if user google user is also a user of codeial then return user else create a user using google profile.  
        if(user){
          return  done(null,user);
        }else{
            res.locals.user = profile.displayName;
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex')
            },function(error,user){
                if(error){
                    console.log('error in creating user using  google oauth',error);
                    return;
                }
                return done(null,user);
            })
        }
    })
}
))