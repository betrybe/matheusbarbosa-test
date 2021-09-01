const mongoose = require('../database');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    }, 
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
        select: false,
    },
    role: {
        type: String,
        require: true,
    },
}, { versionKey: false });

const User = mongoose.model('User', UserSchema);

module.exports = User;