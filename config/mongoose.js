const mongoose = require('mongoose');
const env  = require('./environment');

mongoose.connect(`mongodb://127.0.0.1/${env.db}`);

const dB = mongoose.connection;

dB.on('error', console.error.bind(console, "Error connecting to MongoDB"));

dB.once('open', function(){
    console.log("Connected to the Database :: MongoDB");
});


module.exports = dB;