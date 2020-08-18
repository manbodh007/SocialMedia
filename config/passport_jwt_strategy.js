const passport = require('passport');
const JWTSrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const env = require('./environment');


const User = require('../models/user');
let opts = {
    jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey :env.jwt_secret,
}

passport.use(new JWTSrategy(opts,function(jwtPayLoad,done){

        User.findById(jwtPayLoad._id,function(error,user){
            if(error){
                console.log('error in finding user using jwt');
                return;
            }

            if(user){
                return done(null,user);
            }else{
                return done(null,false);
            }
        })
}))