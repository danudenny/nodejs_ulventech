const jwt = require('jsonwebtoken')
const logger = require('../utils/pinoLogger')
require('dotenv').config();


module.exports = {
    verifyToken: (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
    
        if (token === null) {
            logger.error('Token not found!')
            res.status(401).json({
                message: 'Token not found!'
            })
        }
        
        jwt.verify(token, process.env.JWT_ACCESS, (err, result) => {
            if (err) {
                logger.error('UNAUTHETICATED!')
                res.status(403).json({
                    message: 'UNAUTHETICATED!'
                })
            }
    
            req.email = result.userEmail;
            next();
        })
    }
}