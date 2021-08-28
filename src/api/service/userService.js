const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config.json');

const validEmail = (email) => {
    const reg = /\S+@\S+\.\S+/;
    if (reg.test(email)) {
        return true;
    }
    return false;
};

const validLogin = (user, password, email) => {
    if (user && user.password === password && validEmail(email)) {
        return true;
    }
    return false;
};

const validUser = (name, password, email) => {
    if (!name || !password || !validEmail(email)) {
        return false;
    }
    return true;
};

const addUser = async (name, email, password) => {
    if (!validUser(name, password, email)) {
        return 'invalid';
    }
    if (await User.findOne({ email })) {
        return 'duplicate';
    }
    const user = await User.create({ name, email, password, role: 'user' });
    user.password = undefined;
    return user;
};

const login = async (email, password) => {
    if (!email || !password) {
        return 'invalid';
    }

    const user = await User.findOne({ email }).select('+password');

    if (!validLogin(user, password, email)) {
        return 'Incorrect';
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.secret, {
        expiresIn: 86400,
    });
    return token;
};

const addAdmin = async (name, email, password, reqUser) => {
    if (!validUser(name, password, email)) {
        return 'invalid';
    }

    if (await User.findOne({ email })) {
        return 'duplicate';
    }

    if (reqUser.role !== 'admin') {
        return 'limited';
    }

    const user = await User.create({ name, email, password, role: 'admin' });
    user.password = undefined;
    return user;
};

module.exports = {
    addUser,
    addAdmin,
    login,
};