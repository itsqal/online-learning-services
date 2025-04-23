const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authMiddleware = (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden' });
    }
};

exports.authorizationMiddleware = (req, res, next) => {
    const { userId } = req.params;

    // Ensure the userId in the token matches the userId in the request params
    if (req.user.id !== userId) {
        return res.status(403).json({ message: 'Forbidden: You are not authorized to access this resource' });
    }

    next();
};