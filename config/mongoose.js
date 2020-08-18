const mongoose = require('mongoose');
const env = require('./environment');
mongoose.connect(`mongodb://localhost/${env.db}`);
const db = mongoose.connection;

db.on('error',console.error.bind(console,'error in db connection'));
db.once('open',function(){
    console.log("database is connected successfuly");
});

module.exports = db;