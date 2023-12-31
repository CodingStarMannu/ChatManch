const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');



// authentication using passport 
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true,                   
},
async function(req,email,password,done){
    // find the user and establish the identity
    try{
        const user = await User.findOne({email:email});
    
        if(!user || user.password != password){
          req.flash('error', 'Invalid Username/Password');
          return done(null, false);
        }
        console.log(`${user.name} signed in!`);
        return done(null, user);
    }catch(err){
      req.flash('error', err);
      return done(err);
       }
    }
  )
);


//function using promise syntax

// passport.use(new LocalStrategy({
//   usernameField: 'email'
// }, function(req,email, password, done) {
//   User.findOne({ email: email })
//     .then(function(user) {
//       if (!user || user.password !== password) {
//        req.flash('error', 'Invalid Username/Password');
//         return done(null, false);
//       }
//       console.log(`${user.name} signed in!`);
//       return done(null, user);
//     })
//     .catch(function(err) {
//       req.flash('error', err);
//       return done(err);
//     });
// }));





// serializing the user to decide which key is to be kept in the cookies
// save the id or name in the session
passport.serializeUser(function(user,done){
    done(null, user.id);
});


//deserializing the user from the key in the cookies
// getting the id or (user) from the session

passport.deserializeUser(async function(id, done) {
    try {
      // Find the user
      const user = await User.findById(id);
      if (!user) {
        console.log("Error in finding user");
        return done(null, false);
    }
      return done(null, user);
    } catch (err) {
      console.log("Error in finding user", err);
      return done(err);
    }
  });
  


//check if the user is authenticated

passport.checkAuthentication = function(req, res, next){

    //if the user is signed in, then pass on the request to the next function (controller's action)
    if(req.isAuthenticated()){
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/sign-in');
}


passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user form the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
   
    }

    next();
}


module.exports  = passport;