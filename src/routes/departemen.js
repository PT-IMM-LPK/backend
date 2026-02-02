const express = require('express');
const router = express.Router();
const departemenController = require('../controllers/departemenController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Semua route butuh authentication
router.use(authenticateToken);

// Public untuk semua authenticated users
router.get('/', departemenController.getAll);
router.get('/:id', departemenController.getById);

// Admin only
router.post('/', authorizeRoles('ADMIN', 'SUPER_ADMIN'), departemenController.create);
router.put('/:id', authorizeRoles('ADMIN', 'SUPER_ADMIN'), departemenController.update);
router.delete('/:id', authorizeRoles('ADMIN', 'SUPER_ADMIN'), departemenController.delete);

module.exports = router;