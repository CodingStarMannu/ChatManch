const development = {
    name: 'development',
    asset_path: process.env.CHATMANCH_ASSET_PATH,
    session_cookie_key: process.env.CHATMANCH_SESSION_SECRET_KEY,
    db:'chatManch_development',
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

}

module.exports = eval(process.env.CHATMANCH_ENVIRONMENT)== undefined ? development : eval(process.env.CHATMANCH_ENVIRONMENT);