const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const dB = require('./config/mongoose');

//user for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');


// const sass = require('sass');
// app.use(sassMiddleware({
//   src: '/assets/scss',
//   dest:'/assets/css',
//   debug: true,
//   outputStyle: 'extended',
//   prefix: '/css'
// }))



//reading through the post request
app.use(express.urlencoded());

//setting up the cookie parser
app.use(cookieParser());

//set up static folder
app.use(express.static('./assets'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// Set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store the session cookie in the dB

app.use(
    session({
      name: 'ChatManch',
      // TODO change the secret before deployment in production mode
      secret: 'blahSomething',
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 100 // 100 minutes
      },
      store: MongoStore.create({
        mongoUrl:'mongodb://127.0.0.1/chatManch_development',
        autoRemove: 'disabled'
      },
      (err)=>{
        console.log(err || 'connect-mongoDB setup ok')
    }
      ),
    })
  );

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// Use express router
app.use('/', require('./routes'));

// listen port for server
app.listen(port, function(err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});
