const mongoose = require('mongoose');
const {Schema} = mongoose;

const LogSchema = new Schema({
    "username": String,
    "count": Number,
    "log": Array
});

module.exports = mongoose.model('Log', LogSchema);