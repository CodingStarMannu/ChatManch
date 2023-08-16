const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const dB = require('./config/mongoose');
const bodyParser = require('body-parser');
const path = require('path');

//user for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJwt = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');


const MongoStore = require('connect-mongo');

const flash = require('connect-flash');
const customMware = require('./config/middleware');

//set up the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log("Chat server is Running on port 5000");




//reading through the post request
// app.use(express.urlencoded());
// app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//setting up the cookie parser
app.use(cookieParser());

//set up static folder
app.use(express.static('./assets'));

//Make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));
console.log(__dirname + '/uploads');


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

app.use(flash());
app.use(customMware.setFlash);

// Use express router
app.use('/', require('./routes'));

// listen port for server
app.listen(port, function(err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});
