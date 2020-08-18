const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname,'../production_logs');

fs.existsSync(logDirectory)||fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log',{
     interval:'1d',
     path:logDirectory
});


const development = {
    name :'development',
    assets_path:'./public/assets',
    session_cookie_key:'blah',
    db:'codeial_development',
    smtp:{
        service:'gmail',
        host:'smpt.gmail.com',
        port:587,
        secure:false,
        auth:{
            user:'eroschatofficial@gmail.com',
            pass:'ErosChat@1212'
        }
    },
    google_client_id:"567489393183-krdcp4bd6i1pu0eg1pc58ld5voqfil37.apps.googleusercontent.com",
    google_client_secret:"8-RcGaoj8j6IxhjrWeI1Uttx",
    google_call_back_url:"http://localhost:8000/users/auth/google/callback",
    jwt_secret:'codeial',
    morgan:{
        mode:'dev',
        options:{stream:accessLogStream}
    }
    
}

const production ={
    name:'production',
    assets_path:process.env.CODEIAL_ASSETS_PATH,
    session_cookie_key:process.env.CODEIAL_SESSION_COOKIE_KEY,
    db:process.env.CODEIAL_DB,
    smtp:{
        service:process.env.CODEIAL_SMTP_SERVICE,
        host:process.env.CODEIAL_SMTP_HOST,
        port:process.env.CODEIAL_SMTP_PORT,
        secure:process.env.CODEIAL_SMTP_SECURE,
        auth:{
            user:process.env.CODEIAL_SMTP_AUTH_USER,
            pass:process.env.CODEIAL_SMTP_AUTH_PASS
        }
    },
    google_client_id:process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret:process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_call_back_url:process.env.CODEIAL_GOOGLE_CALL_BACK_URL,
    jwt_secret:process.env.CODEIAL_JWT_SECRET,
    morgan:{
        mode:'combined',
        options:{stream:accessLogStream}
    }

}


module.exports = production;
