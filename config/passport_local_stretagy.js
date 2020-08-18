const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
//authentication using passport
passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true

},function(req,email,password,done){
    //finding the user and authenticate
   User.findOne({email:email},function(err,user){
       if(err)
       {
           req.flash('error',err);
           return done(err);
       }
       if(!user||user.password!=password){
           req.flash('error',"invalid username or password!");
           return done(null,false);
       }
       return done(null,user);
   })
})
);

//serializing the user that which key is kept in cookie
passport.serializeUser(function(user,done){
     return done(null,user.id);
})
//deserializing the user from the cookie id to authenticate which user is loged in
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log("error in finding user using passport");
            return done(err);
        }
        
        return done(null,user);
    })
});
// check if user is authenticated
passport.checkAuthentication = function(req,res,next){
    // if the user is signed in then pass the request to the next function (controller,s action)
    if(req.isAuthenticated()){
        return next();
    }
    //if the user is not signed in
    return res.redirect('/');
}
passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user we are just sending the data to the locals for a views
        res.locals.user = req.user;
    }
    next();
}
module.exports = passport;