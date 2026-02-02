const bcrypt = require('bcryptjs');
const prisma = require('../config/database');

// Get All Pengguna
exports.getAll = async (req, res, next) => {
  try {
    const { role, departemenId, search } = req.query;

    // Build where clause
    const where = {};

    if (role) {
      where.role = role;
    }

    if (departemenId) {
      where.departemenId = parseInt(departemenId);
    }

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const pengguna = await prisma.pengguna.findMany({
      where,
      select: {
        nomor: true,
        nama: true,
        email: true,
        nomorTelepon: true,
        tanggalLahir: true,
        role: true,
        departemen: {
          select: {
            nomor: true,
            namaDepartemen: true
          }
        },
        createdAt: true
      },
      orderBy: {
        nama: 'asc'
      }
    });

    res.json({
      success: true,
      data: { pengguna }
    });

  } catch (error) {
    next(error);
  }
};

// Get Pengguna by ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pengguna = await prisma.pengguna.findUnique({
      where: { nomor: parseInt(id) },
      select: {
        nomor: true,
        nama: true,
        email: true,
        nomorTelepon: true,
        tanggalLahir: true,
        role: true,
        departemen: {
          select: {
            nomor: true,
            namaDepartemen: true
          }
        },
        createdAt: true,
        updatedAt: true
      }
    });

    if (!pengguna) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: { pengguna }
    });

  } catch (error) {
    next(error);
  }
};

// Create Pengguna (Admin only)
exports.create = async (req, res, next) => {
  try {
    const {
      nama,
      email,
      password,
      nomorTelepon,
      tanggalLahir,
      departemenId,
      role
    } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password || 'password123', 10);

    const pengguna = await prisma.pengguna.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        nomorTelepon,
        tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : null,
        departemenId: departemenId ? parseInt(departemenId) : null,
        role: role || 'KARYAWAN'
      },
      select: {
        nomor: true,
        nama: true,
        email: true,
        nomorTelepon: true,
        role: true,
        departemen: {
          select: {
            nomor: true,
            namaDepartemen: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Pengguna berhasil dibuat',
      data: { pengguna }
    });

  } catch (error) {
    next(error);
  }
};

// Update Pengguna
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nama,
      email,
      nomorTelepon,
      tanggalLahir,
      departemenId,
      role
    } = req.body;

    // Build update data
    const updateData = {};
    if (nama) updateData.nama = nama;
    if (email) updateData.email = email;
    if (nomorTelepon !== undefined) updateData.nomorTelepon = nomorTelepon;
    if (tanggalLahir) updateData.tanggalLahir = new Date(tanggalLahir);
    if (departemenId !== undefined) {
      updateData.departemenId = departemenId ? parseInt(departemenId) : null;
    }
    if (role && req.user.role === 'ADMIN') {
      updateData.role = role;
    }

    const pengguna = await prisma.pengguna.update({
      where: { nomor: parseInt(id) },
      data: updateData,
      select: {
        nomor: true,
        nama: true,
        email: true,
        nomorTelepon: true,
        tanggalLahir: true,
        role: true,
        departemen: {
          select: {
            nomor: true,
            namaDepartemen: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Pengguna berhasil diupdate',
      data: { pengguna }
    });

  } catch (error) {
    next(error);
  }
};

// Delete Pengguna (Admin only)
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.pengguna.delete({
      where: { nomor: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Pengguna berhasil dihapus'
    });

  } catch (error) {
    next(error);
  }
};