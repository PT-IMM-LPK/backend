const express = require('express');
const router = express.Router();
const penggunaController = require('../controllers/penggunaController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Semua route butuh authentication
router.use(authenticateToken);

// Public untuk semua authenticated users
router.get('/', penggunaController.getAll);
router.get('/:id', penggunaController.getById);

// Admin only
router.post('/', authorizeRoles('ADMIN', 'SUPER_ADMIN'), penggunaController.create);
router.put('/:id', authorizeRoles('ADMIN', 'SUPER_ADMIN'), penggunaController.update);
router.delete('/:id', authorizeRoles('ADMIN', 'SUPER_ADMIN'), penggunaController.delete);

module.exports = router;