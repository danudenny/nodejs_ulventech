const logger = require('../utils/pinoLogger')

exports.admin = async(req, res) => {
    try {
        res.status(200).json('Hello ADMIN')
    } catch (error) {
        logger.error(error)
    }
};

exports.customer = async(req, res) => {
    try {
        res.status(200).json('Hello CUSTOMER')
    } catch (error) {
        logger.error(error)
    }
};