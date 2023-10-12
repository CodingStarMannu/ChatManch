const morgan = require('morgan')
const path = require('path')
const rfs = require('rotating-file-stream');
const fs = require("fs");

var logDirectory = path.join(__dirname, "..",'production_logs');

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
  })


const development = {
    name: 'development',
    asset_path: '/assets',
    session_cookie_key: '12GmMs6t1RlCDPrG68gW2HGeAZSLoat5',
    db:'chatManch_development',
    smtp:{
        service: 'gmail',
        host:'smtp.gmail.com',
        port: 587,
        secure:false,
        auth:{
                user:'manojpant097@gmail.com',
                pass:'doemyihthlwhxmnd'
        }
    },
    google_client_id:"24451857770-qbm14s4jdsh67fr63m5pu1vq88peen6u.apps.googleusercontent.com",
    google_client_secret:"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",
    google_call_back_url:"http://localhost:8000/users/auth/google/callback",
    jwt_secret:'d7q0XHkyfV4xkJa8AqLfDUfYMoxSfeYz',
    morgan:{
        mode:'dev',
        options : {stream: accessLogStream}
    }
    
}

const production ={
    name: 'production',
    asset_path: process.env.CHATMANCH_ASSET_PATH,
    session_cookie_key: process.env.CHATMANCH_SESSION_SECRET_KEY,
    db:process.env.CHATMANCH_DB,
    smtp:{
        service: 'gmail',
        host:'smtp.gmail.com',
        port: 587,
        secure:false,
        auth:{
            user:process.env.CHATMANCH_GMAIL_USER,
            pass:process.env.CHATMANCH_GMAIL_PASSWORD,
        }
    },
    google_client_id:process.env.CHATMANCH_CLIENT_ID,
    google_client_secret:process.env.CHATMANCH_CLIENT_SECRET,
    google_call_back_url:process.env.CHATMANCH_CALL_BACK_URL,
    jwt_secret: process.env.CHATMANCH_JWT_SECRET,
    morgan:{
        mode:'combined',
        options : {stream: accessLogStream}
    }

}


module.exports = eval(process.env.CHATMANCH_ENVIRONMENT)== undefined ? development : eval(process.env.CHATMANCH_ENVIRONMENT);

// const selectedEnvironment = process.env.CHATMANCH_ENVIRONMENT || 'development';

// const config = selectedEnvironment === 'production' ? production : development;

// module.exports = config;