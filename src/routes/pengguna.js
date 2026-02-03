const express = require('express');
const router = express.Router();
const penggunaController = require('../controllers/penggunaController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Semua route butuh authentication
router.use(authenticateToken);

/**
 * @swagger
 * /api/pengguna:
 *   get:
 *     summary: Get semua pengguna
 *     tags: [Pengguna]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [KARYAWAN, SUPERVISOR, ADMIN, SUPER_ADMIN]
 *         description: Filter berdasarkan role
 *       - in: query
 *         name: departemenId
 *         schema:
 *           type: integer
 *         description: Filter berdasarkan departemen
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Cari berdasarkan nama atau email
 *     responses:
 *       200:
 *         description: Daftar pengguna berhasil diambil
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
 *                     pengguna:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Pengguna'
 *       401:
 *         description: Unauthorized
 */
router.get('/', penggunaController.getAll);

/**
 * @swagger
 * /api/pengguna/{id}:
 *   get:
 *     summary: Get pengguna berdasarkan ID
 *     tags: [Pengguna]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Pengguna
 *     responses:
 *       200:
 *         description: Detail pengguna
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
 *                     pengguna:
 *                       $ref: '#/components/schemas/Pengguna'
 *       404:
 *         description: Pengguna tidak ditemukan
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', penggunaController.getById);

/**
 * @swagger
 * /api/pengguna:
 *   post:
 *     summary: Buat pengguna baru (Admin only)
 *     tags: [Pengguna]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PenggunaInput'
 *     responses:
 *       201:
 *         description: Pengguna berhasil dibuat
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
 *                   example: Pengguna berhasil dibuat
 *                 data:
 *                   type: object
 *                   properties:
 *                     pengguna:
 *                       $ref: '#/components/schemas/Pengguna'
 *       400:
 *         description: Validasi error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Role tidak memiliki akses
 */
router.post('/', authorizeRoles('ADMIN', 'SUPER_ADMIN'), penggunaController.create);

/**
 * @swagger
 * /api/pengguna/{id}:
 *   put:
 *     summary: Update pengguna (Admin only)
 *     tags: [Pengguna]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Pengguna
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *               email:
 *                 type: string
 *               nomorTelepon:
 *                 type: string
 *               tanggalLahir:
 *                 type: string
 *                 format: date
 *               departemenId:
 *                 type: integer
 *               role:
 *                 type: string
 *                 enum: [KARYAWAN, SUPERVISOR, ADMIN, SUPER_ADMIN]
 *     responses:
 *       200:
 *         description: Pengguna berhasil diupdate
 *       404:
 *         description: Pengguna tidak ditemukan
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/:id', authorizeRoles('ADMIN', 'SUPER_ADMIN'), penggunaController.update);

/**
 * @swagger
 * /api/pengguna/{id}:
 *   delete:
 *     summary: Hapus pengguna (Admin only)
 *     tags: [Pengguna]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Pengguna
 *     responses:
 *       200:
 *         description: Pengguna berhasil dihapus
 *       404:
 *         description: Pengguna tidak ditemukan
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete('/:id', authorizeRoles('ADMIN', 'SUPER_ADMIN'), penggunaController.delete);

module.exports = router;