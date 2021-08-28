const userService = require('../service/userService');

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    
    const user = await userService.addUser(name, email, password);
    
    if (user === 'invalid') {
        return res.status(400).send({ message: 'Invalid entries. Try again.' });
    }

    if (user === 'duplicate') {
        return res.status(409).send({ message: 'Email already registered' });
    }

    return res.status(201).send({ user });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const token = await userService.login(email, password);

    if (token === 'invalid') {
        return res.status(401).send({ message: 'All fields must be filled' });
    }

    if (token === 'Incorrect') {
        return res.status(401).send({ message: 'Incorrect username or password' });
    }

    res.send({ token });
};

const createAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await userService.addAdmin(name, email, password, req.user);

    if (user === 'invalid') {
        return res.status(400).send({ message: 'Invalid entries. Try again.' });
    }

    if (user === 'duplicate') {
        return res.status(409).send({ message: 'Email already registered' });
    }

    if (user === 'limited') {
        return res.status(403).send({ message: 'Only admins can register new admins' });
    }
    return res.status(201).send({ user });
};

module.exports = {
    createAdmin,
    login,
    createUser,
};