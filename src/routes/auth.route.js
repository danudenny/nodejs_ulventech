const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/auth_controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         email: denny@gmail.com
 *         password: 123456
 */

/**
 * @swagger
 *  tags:
 *    name: Auth
 *    description: Authentication
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
*             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: The user was successfully login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auth'
 *       500:
 *         description: Some server error
 */
router.post('/login', auth_controller.login)

router.post('/refresh-token', auth_controller.refreshToken)

router.post('/logout', auth_controller.logout)

module.exports = router;