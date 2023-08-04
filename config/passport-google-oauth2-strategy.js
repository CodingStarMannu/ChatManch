const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');


//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID:"24451857770-qbm14s4jdsh67fr63m5pu1vq88peen6u.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:8000/users/auth/google/callback",
},async function(accessToken, refreshToken, profile, done){

    try{
        //find a user
        const user = await User.findOne({email: profile.emails[0].value}).exec();
   
            console.log(profile);
            console.log(accessToken, refreshToken);

            if(user){
                //if found set this a req.user
                return  done(null,user);
            }else{
                // if not found ,create the user and set it as req.user 
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