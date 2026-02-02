const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

// Middleware untuk verifikasi token
const authenticateToken = async (req, res, next) => {
  try {
    // Ambil token dari header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan. Silakan login.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Cari user di database
    const user = await prisma.pengguna.findUnique({
      where: { nomor: decoded.userId },
      select: {
        nomor: true,
        nama: true,
        email: true,
        role: true,
        departemenId: true,
        departemen: {
          select: {
            nomor: true,
            namaDepartemen: true
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Simpan user ke request object
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: 'Token tidak valid'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'Token kadaluarsa. Silakan login kembali.'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Gagal autentikasi'
    });
  }
};

// Middleware untuk cek role
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke resource ini'
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};