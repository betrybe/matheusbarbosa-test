const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports = (req, res, next) => {
    const token = req.headers.authorization;
    
    if (!token) return res.status(401).send({ message: 'missing auth token' });

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) return res.status(401).send({ message: 'jwt malformed' });

        req.userId = decoded.id;
        req.user = {
            id: decoded.id,
            email: decoded.email, 
            role: decoded.role,
        };
        
        return next();
    });
};
