const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const user = require('../models/user');
const User = require('../models/user');

let opts = {

    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken,
    secretOrKey : 'chatmanch'
}


passport.use(new JWTStrategy(opts, async function(jwtPayload, done) {
    try {
        const user = await User.findById(jwtPayload._id);

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        console.log("Error in finding the user from JWT", err);
        return done(err, false);
    }
}));

//callback function
// passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){
    
//     User.findById(jwtPayLoad._id, function(err, user){
//         if(err){console.log("Error in finding the user form JWT"); return;}

//         if(user){
//             return done(null, user);
//         }else{
//             return done(null, false);
//         }
//     })
// }));


module.exports = passport;