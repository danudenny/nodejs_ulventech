const bcrypt = require('bcrypt');
const logger = require('../utils/pinoLogger')
const users = require('../db/models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config()

exports.login = async(req, res) => {
    const { email, password } = req.body;

    let strPass = password.toString();
    
    try {
        const grabUser = await users.query()
            .select('users.id', 'users.first_name', 'users.last_name', 'users.email', 'users.password', 'roles.name as roleName')
            .leftJoin('roles', 'roles.id', 'users.role_id')
            .where('email', '=', email);
                
        if (grabUser.length === 0) {
            logger.error('Email not found!')
            res.status(400).json({
                message: 'Email not found!'
            })
        }

        const comparePassword = await bcrypt.compare(strPass, grabUser[0].password);
        if (!comparePassword) {
            logger.error('Wrong Password!')
            res.status(400).json({
                message: 'Wrong Password!'
            })
        }

        const userId = grabUser[0].id;
        const userName = `${grabUser[0].first_name} ${grabUser[0].last_name}`
        const userEmail = grabUser[0].email
        const userRole = grabUser[0].roleName
        const accessToken = jwt.sign({userId, userName, userEmail, userRole}, process.env.JWT_ACCESS, {
            expiresIn: '1h'
        })
        const refreshToken = jwt.sign({userId, userName, userEmail, userRole}, process.env.JWT_REFRESH, {
            expiresIn: '2h'
        })
        
        await users.query()
            .findById(userId)
            .patch({
                refresh_token: refreshToken,
            });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        logger.info('Login Success')
        res.status(200).json({
            message: `Login Success as ${userRole}`,
            accessToken: accessToken
        })
    } catch (error) {
        logger.error(error.message)
        res.status(500).json({
            message: error.message
        })
    }
}

exports.refreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) {
            logger.error('Invalid refresh token')
            res.status(401).json({
                message: 'Invalid refresh token',
            })
        }

        const grabUser = await users.query()
            .where('refresh_token', '=', refreshToken);
        
        if (grabUser.length === 0) {
            logger.error('UNAUTHENTICATED!')
            res.status(403).json({
                message: 'UNAUTHENTICATED!',
            })
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH, (err, result) => {
            if (err) {
                logger.error('UNAUTHENTICATED!')
                res.status(403).json({
                    message: 'UNAUTHENTICATED!',
                })
            }

            const userId = grabUser[0].id;
            const userName = `${grabUser[0].first_name} ${grabUser[0].last_name}`
            const userEmail = grabUser[0].email;
            const accessToken = jwt.sign({userId, userName, userEmail}, process.env.JWT_ACCESS, {
                expiresIn: '1h'
            });
            logger.info('Success Renew Token')
            res.status(200).json({
                message: 'Success Renew Token',
                accessToken: accessToken
            })
        })
    } catch (error) {
        logger.error(error.message)
        res.status(500).json({
            message: error.message
        })
    }
}

exports.logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) {
        logger.error('Invalid token')
        res.status(401).json({
            message: 'Invalid token',
        })
    }

    const grabUser = await users.query()
        .where('refresh_token', '=', refreshToken);
        
    if (grabUser.length < 1) {
        logger.error('UNAUTHENTICATED!')
        res.status(403).json({
            message: 'UNAUTHENTICATED!',
        })
    }

    const userId = grabUser[0].id;
    try {
        await users.query()
        .findById(userId)
        .patch({
            refresh_token: null,
        });

        res.clearCookie('refreshToken')
        logger.info('Success Logout')
        return res.status(200).json({
            message: 'Success Logout',
        })
    } catch (error) {
        logger.error(error.message)
        res.status(500).json({
            message: error.message
        })
    }
    
}