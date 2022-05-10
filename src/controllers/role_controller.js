const bcrypt = require('bcrypt');
const logger = require('../utils/pinoLogger')
const Role = require('../db/models/role');

exports.list = async(req, res) => {
    try {
        const getRole = await Role.query();
        res.status(200).json(getRole)
    } catch (error) {
        logger.error(error)
    }
};

exports.create = async(req, res) => {
    const {name, description} = req.body

    try {
        await Role.query().insert({
            name: name,
            description: description,
        });
        logger.info('Success Create Role')
        res.status(200).json({
            message: 'Success Create Role'
        })
    } catch (error) {
        logger.error(error)
        if (error.name === 'UniqueViolationError' && error.columns[0] === 'name') {
            logger.error('Duplicate error')
            res.status(400).json({
                message: `Role ${name} already taken, use another!`,
            })
        }

        res.status(500).json({
            message: 'Something went wrong',
            error: error
        })
    }
};

exports.update = async(req, res) => {
    const {name, description} = req.body

    const getRole = await Role.query()
        .where('id', '=', req.params.id)
    
    if (getRole.length === 0) {
        logger.error(`ID '${req.params.id}' not found`)
        res.status(400).json({
            message: `ID '${req.params.id}' not found`
        })
    }

    try {
        const salt = await bcrypt.genSalt();
        await Role.query()
        .findById(req.params.id)
        .patch({
            name: name ? name : getRole[0].name,
            description: description ? description : getRole[0].description,
        });
        logger.info('Success Update Role')
        res.status(200).json({
            message: 'Success Update Role'
        })
    } catch (err) {
        logger.error(err)
        res.status(500).json({
            message: 'Something went wrong',
            error: err
        })
    }
}

exports.show = async(req, res) => {
    const getRoleId = await Role.query()
        .where('id', '=', req.params.id)

    if (getRoleId.length === 0) {
        res.status(400).json({
            message: `ID '${req.params.id}' not found`
        })
    }

    try {
        const getRole = await Role.query()
            .where('id', '=', req.params.id);
            
        res.status(200).json(getRole)
    } catch (err) {
        logger.error(err)
        res.status(500).json({
            message: 'Something went wrong',
            error: err
        })
    }
} 

exports.delete = async(req, res) => {
    const getRole = await Role.query()
        .where('id', '=', req.params.id)

    if (getRole.length === 0) {
        res.status(400).json({
            message: `ID '${req.params.id}' not found`
        })
    }

    try {
        await Role.query().deleteById(req.params.id);
        logger.info('Success remove role')
        res.status(200).json({
            message: 'Success remove role'
        })
    } catch (err) {
        logger.error(err)
        res.status(500).json({
            message: 'Something went wrong',
            error: err
        })
    }
} 
