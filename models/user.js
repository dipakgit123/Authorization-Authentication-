const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/authapp');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    age: Number
});

// Export the model properly
module.exports = mongoose.model('User', userSchema);
