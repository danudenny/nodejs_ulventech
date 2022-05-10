const jwt = require('jsonwebtoken')
const logger = require('../utils/pinoLogger')
require('dotenv').config();

module.exports = function hasRole(roles) {
    return async function(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
    
        if (token === null) {
            logger.error('Token not found!')
            res.status(401).json({
                message: 'Token not found!'
            })
        }
        
        jwt.verify(token, process.env.JWT_ACCESS, (err, result) => {
            if (!result || !roles.includes(result.userRole)) {
                logger.error('Access Denied.')
                return res.status(403).send({error: { status:403, message:`Access denied.` }});
              }
            next();
        })

    }
}