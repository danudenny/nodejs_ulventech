const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user_controller');
const tokenized = require('../middleware/VerifyToken');
const authorized = require('../middleware/VerifyRole');

/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - password
 *         - role_id
 *       properties:
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         role_id:
 *           type: integer
 *       example:
 *         first_name: Denny
 *         last_name: Danuwijaya
 *         email: denny@gmail.com
 *         password: 123456
 *         role_id: 1
 */

/**
 * @swagger
 *  tags:
 *    name: Users
 *    description: Users data
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Returns all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: the list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Users'
 */
router.get('/', tokenized.verifyToken, authorized(['ADMIN', 'CUSTOMER']), user_controller.list)

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new User
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
*             $ref: '#/components/schemas/Users'
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       500:
 *         description: Some server error
 */
 
router.post('/', user_controller.create);
router.get('/:id', tokenized.verifyToken, authorized(['ADMIN', 'CUSTOMER']),user_controller.show);
router.patch('/:id/update', tokenized.verifyToken, authorized(['ADMIN']),user_controller.update);
router.delete('/:id/delete', tokenized.verifyToken, authorized(['ADMIN']),user_controller.delete);

module.exports = router;