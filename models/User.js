const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //plug-in qui empêche d'utiliser plusieurs fois la même adresse email

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    userId: { type: String, required: false}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);