const express = require('express');
const env = require('./config/environment');
// const envVariable = require('dotenv').config();
const logger = require('morgan');
const app = express();
require('./config/view_helper')(app);
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport_local_stretagy');
const passportJWT = require('./config/passport_jwt_strategy');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const costomFlashMware = require('./config/middleware');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const sassMiddleware = require('node-sass-middleware');
const { debug } = require('console');

const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);


if(env.name =='development'){
    app.use(sassMiddleware({
        src:'./assets/scss',
        dest:'./assets/css',
        debug:true,
        outputStyle:'extended',
        prefix:'/css'
    }));
}

app.use(expressLayouts);
app.use(cookieParser());
app.use(express.static(env.assets_path));
app.use(express.urlencoded());

app.use(logger(env.morgan.mode,env.morgan.options));

//set view engine
app.set('view engine','ejs');
app.set('views','./views');

// mongoose.connect('mongodb://localhost/wep_app_dev');
// mongo store is used to store the session cookie in the db
app.use(session({
    name:'new',
    secret:env.session_cookie_key,
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store: new MongoStore({
        mongooseConnection:mongoose.connection,
        autoRemove:'disabled'
    },function(err){
        if(err){
           console.log(err);
        }
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(costomFlashMware.setFlash);
// make the uploads path available to the browser
app.use('/uploads',express.static(__dirname + '/uploads'));

// setup script and style from sub pages to layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

app.use('/',require('./routers/index'));
 


app.listen(port,function(error){
    if(error){
        console.log(`error in running the server:${error}`);
        return;
    }else{
        console.log(`server is running on port:${port}`);
    }
})

