const express = require('express');
const home_controller = require('../controllers/home_controller')
const router = express.Router();
const tokenized = require('../middleware/VerifyToken');
const authorized = require('../middleware/VerifyRole');
/**
 * @swagger
 * components:
 *   schemas:
 *     Hello:
 *       type: string
 */

/**
 * @swagger
 *  tags:
 *    name: Hello
 *    description: Hello world!
 */

/**
 * @swagger
 * /api/home/hello-admin:
 *   get:
 *     summary: Returns admin page
 *     tags: [Hello]
 *     responses:
 *       200:
 *         description: Admin page
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hello'
 */
router.get('/hello-admin', tokenized.verifyToken, authorized(['ADMIN']), home_controller.admin)

/**
 * @swagger
 * /api/home/hello-customer:
 *   get:
 *     summary: Returns customer page
 *     tags: [Hello]
 *     responses:
 *       200:
 *         description: Customer page
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hello'
 */
router.get('/hello-customer', tokenized.verifyToken, authorized(['CUSTOMER']), home_controller.customer);

module.exports = router;