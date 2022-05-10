const express = require('express');
const router = express.Router();
const role_controller = require('../controllers/role_controller');
const tokenized = require('../middleware/VerifyToken');
const authorized = require('../middleware/VerifyRole');

router
    .get('/', tokenized.verifyToken, authorized(['ADMIN']), role_controller.list)
    .post('/', tokenized.verifyToken, authorized(['ADMIN']), role_controller.create);
router.get('/:id', tokenized.verifyToken, authorized(['ADMIN']), role_controller.show);
router.patch('/:id/update', tokenized.verifyToken, authorized(['ADMIN']), role_controller.update);
router.delete('/:id/delete', tokenized.verifyToken, authorized(['ADMIN']), role_controller.delete);

module.exports = router;