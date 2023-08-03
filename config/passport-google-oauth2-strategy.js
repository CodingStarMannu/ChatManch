const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const { config } = require('process');



passport.use(new googleStrategy.GoogleStrategy({
    clientID:"24451857770-qbm14s4jdsh67fr63m5pu1vq88peen6u.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:8000/users/auth/google/callback",
},async function(accessToken, refreshToken, profile, done){

    try{
        const user = await User.findOne({email: profile.email[0].Value}).exec();
   
            console.log(profile);

            if(user){
                return  done(null,user);
            }else{
             const newUser =  await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex'),
                });
                return done(null,newUser);
            }
     }catch(err){
        console.log("Error in google strategy passport" , err);
        return done(err, null);
    }
}));