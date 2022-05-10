const bcrypt = require('bcrypt');
const logger = require('../utils/pinoLogger')
const users = require('../db/models/user');

exports.list = async(req, res) => {
    try {
        const getUser = await users.query()
            .select('users.id', 'first_name', 'last_name', 'email', 'roles.name as role_name')
            .leftJoin('roles', function() {
                this.on('roles.id', '=', 'users.role_id')
            });
        res.status(200).json(getUser)
    } catch (error) {
        logger.error(error)
    }
};

exports.create = async(req, res) => {
    const {first_name, last_name, email, password, refresh_token, role_id} = req.body

    let strPass = password.toString();

    try {
        const salt = await bcrypt.genSalt();
        await users.query().insert({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: await bcrypt.hash(strPass,salt),
            refresh_token: refresh_token ? refresh_token : null,
            role_id: role_id ? role_id : null,
        });
        logger.info('Success Create User')
        res.status(200).json({
            message: 'Success Create User'
        })
    } catch (error) {
        console.log(error.name);
        // !HINT Unique Error
        if (error.name === 'UniqueViolationError' && error.columns[0] === 'email') {
            res.status(400).json({
                message: 'Email already taken, use another!',
            })
        }

        // !HINT Foreign Error
        if (error.name === 'ForeignKeyViolationError') {
            res.status(400).json({
                message: 'Role unknown!',
            })
        }

        // !HINT Internal Error
        logger.error(error.message)
        res.status(500).json({
            message: 'Something went wrong',
            error: error.message
        })
    }
};

exports.update = async(req, res) => {
    const {first_name, last_name, email, password, refresh_token, role_id} = req.body

    let strPass = password.toString();

    const getUser = await users.query()
        .where('id', '=', req.params.id)
    
    if (getUser.length === 0) {
        logger.error(`ID '${req.params.id}' not found`)
        res.status(400).json({
            message: `ID '${req.params.id}' not found`
        })
    }

    try {
        const salt = await bcrypt.genSalt();
        await users.query()
        .findById(req.params.id)
        .patch({
            first_name: first_name ? first_name : getUser[0].first_name,
            last_name: last_name ? last_name : getUser[0].last_name,
            email: email ? email : getUser[0].email,
            password: strPass ? await bcrypt.hash(strPass,salt) : getUser[0].password,
            refresh_token: refresh_token ? refresh_token : getUser[0].refresh_token,
            role_id: role_id ? role_id : getUser[0].role_id
        });
        logger.info('Success update user')
        res.status(200).json({
            message: 'Success update user'
        })
    } catch (error) {
        // !HINT Unique Error
        if (error.name === 'UniqueViolationError' && error.columns[0] === 'email') {
            res.status(400).json({
                message: 'Email already taken, use another!',
            })
        }

        // !HINT Foreign Error
        if (error.name === 'ForeignKeyViolationError') {
            res.status(400).json({
                message: 'Role unknown!',
            })
        }

        // !HINT Internal Error
        logger.error(error.message)
        res.status(500).json({
            message: 'Something went wrong',
            error: error.message
        })
    }
}

exports.show = async(req, res) => {
    const getUserId = await users.query()
        .where('id', '=', req.params.id)

    if (getUserId.length === 0) {
        res.status(400).json({
            message: `ID '${req.params.id}' not found`
        })
    }

    try {
        const getUser = await users.query()
            .select('users.id', 'first_name', 'last_name', 'email', 'roles.name as role_name')
            .leftJoin('roles', function() {
                this.on('roles.id', '=', 'users.role_id')
            });
        res.status(200).json(getUser)
    } catch (err) {
        logger.error(err)
        res.status(500).json({
            message: 'Something went wrong',
            error: err
        })
    }
} 

exports.delete = async(req, res) => {
    const getUser = await users.query()
        .where('id', '=', req.params.id)

    if (getUser.length === 0) {
        res.status(400).json({
            message: `ID '${req.params.id}' not found`
        })
    }

    try {
        await users.query().deleteById(req.params.id);
        logger.info('Success remove user')
        res.status(200).json({
            message: 'Success remove user'
        })
    } catch (err) {
        logger.error(err)
        res.status(500).json({
            message: 'Something went wrong',
            error: err
        })
    }
}
