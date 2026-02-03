const express = require('express');
const router = express.Router();
const departemenController = require('../controllers/departemenController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Semua route butuh authentication
router.use(authenticateToken);

/**
 * @swagger
 * /api/departemen:
 *   get:
 *     summary: Get semua departemen
 *     tags: [Departemen]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar departemen berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     departemen:
 *                       type: array
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Departemen'
 *                           - type: object
 *                             properties:
 *                               _count:
 *                                 type: object
 *                                 properties:
 *                                   pengguna:
 *                                     type: integer
 *                                     example: 5
 *       401:
 *         description: Unauthorized
 */
router.get('/', departemenController.getAll);

/**
 * @swagger
 * /api/departemen/{id}:
 *   get:
 *     summary: Get departemen berdasarkan ID
 *     tags: [Departemen]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Departemen
 *     responses:
 *       200:
 *         description: Detail departemen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     departemen:
 *                       allOf:
 *                         - $ref: '#/components/schemas/Departemen'
 *                         - type: object
 *                           properties:
 *                             pengguna:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/Pengguna'
 *       404:
 *         description: Departemen tidak ditemukan
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', departemenController.getById);

/**
 * @swagger
 * /api/departemen:
 *   post:
 *     summary: Buat departemen baru (Admin only)
 *     tags: [Departemen]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DepartemenInput'
 *     responses:
 *       201:
 *         description: Departemen berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Departemen berhasil dibuat
 *                 data:
 *                   type: object
 *                   properties:
 *                     departemen:
 *                       $ref: '#/components/schemas/Departemen'
 *       400:
 *         description: Validasi error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Role tidak memiliki akses
 */
router.post('/', authorizeRoles('ADMIN', 'SUPER_ADMIN'), departemenController.create);

/**
 * @swagger
 * /api/departemen/{id}:
 *   put:
 *     summary: Update departemen (Admin only)
 *     tags: [Departemen]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Departemen
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DepartemenInput'
 *     responses:
 *       200:
 *         description: Departemen berhasil diupdate
 *       404:
 *         description: Departemen tidak ditemukan
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/:id', authorizeRoles('ADMIN', 'SUPER_ADMIN'), departemenController.update);

/**
 * @swagger
 * /api/departemen/{id}:
 *   delete:
 *     summary: Hapus departemen (Admin only)
 *     tags: [Departemen]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Departemen
 *     responses:
 *       200:
 *         description: Departemen berhasil dihapus
 *       404:
 *         description: Departemen tidak ditemukan
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete('/:id', authorizeRoles('ADMIN', 'SUPER_ADMIN'), departemenController.delete);

module.exports = router;