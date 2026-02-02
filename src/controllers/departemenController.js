const prisma = require('../config/database');

// Get All Departemen
exports.getAll = async (req, res, next) => {
  try {
    const departemen = await prisma.departemen.findMany({
      include: {
        _count: {
          select: { pengguna: true }
        }
      },
      orderBy: {
        namaDepartemen: 'asc'
      }
    });

    res.json({
      success: true,
      data: { departemen }
    });

  } catch (error) {
    next(error);
  }
};

// Get Departemen by ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const departemen = await prisma.departemen.findUnique({
      where: { nomor: parseInt(id) },
      include: {
        pengguna: {
          select: {
            nomor: true,
            nama: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (!departemen) {
      return res.status(404).json({
        success: false,
        message: 'Departemen tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: { departemen }
    });

  } catch (error) {
    next(error);
  }
};

// Create Departemen (Admin only)
exports.create = async (req, res, next) => {
  try {
    const { namaDepartemen } = req.body;

    if (!namaDepartemen) {
      return res.status(400).json({
        success: false,
        message: 'Nama departemen wajib diisi'
      });
    }

    const departemen = await prisma.departemen.create({
      data: { namaDepartemen }
    });

    res.status(201).json({
      success: true,
      message: 'Departemen berhasil dibuat',
      data: { departemen }
    });

  } catch (error) {
    next(error);
  }
};

// Update Departemen (Admin only)
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { namaDepartemen } = req.body;

    const departemen = await prisma.departemen.update({
      where: { nomor: parseInt(id) },
      data: { namaDepartemen }
    });

    res.json({
      success: true,
      message: 'Departemen berhasil diupdate',
      data: { departemen }
    });

  } catch (error) {
    next(error);
  }
};

// Delete Departemen (Admin only)
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Cek apakah ada pengguna di departemen ini
    const userCount = await prisma.pengguna.count({
      where: { departemenId: parseInt(id) }
    });

    if (userCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Tidak dapat menghapus departemen. Masih ada ${userCount} pengguna terdaftar.`
      });
    }

    await prisma.departemen.delete({
      where: { nomor: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Departemen berhasil dihapus'
    });

  } catch (error) {
    next(error);
  }
};