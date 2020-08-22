
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');
const crypto = require('crypto');

passport.use(new FacebookStrategy({
    clientID: 910418996113209,
    clientSecret: '082f754a9b8e6ec91ad5c442d1550e8a',
    callbackURL: "http://localhost:8000/users/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log('profile',profile);
    User.findOne({ email: profile.emails[0].value}, function (err, user) {
        if(err){
            console.log('error in facebook authentication',err);
            return;
        }

        if(user){
            console.log('user is found');
            return cb(null, user);
        }else{
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                passport:crypto.randomBytes(20).toString('hex')
            },function(err,user){
                return cb(null, user);
            });
           
        }
    });
    

  }
));