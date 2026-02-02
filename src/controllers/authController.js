const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { generateToken } = require('../utils/jwt');

// Register User Baru
exports.register = async (req, res, next) => {
  try {
    const {
      nama,
      email,
      password,
      nomorTelepon,
      tanggalLahir,
      departemenId
    } = req.body;

    // Validasi input
    if (!nama || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nama, email, dan password wajib diisi'
      });
    }

    // Cek email sudah terdaftar
    const existingUser = await prisma.pengguna.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const user = await prisma.pengguna.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        nomorTelepon,
        tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : null,
        departemenId: departemenId ? parseInt(departemenId) : null,
        role: 'KARYAWAN' // Default role
      },
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

    // Generate token
    const token = generateToken(user.nomor);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        token,
        user
      }
    });

  } catch (error) {
    next(error);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi'
      });
    }

    // Cari user berdasarkan email
    const user = await prisma.pengguna.findUnique({
      where: { email },
      include: {
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
        message: 'Email atau password salah'
      });
    }

    // Cek password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Generate token
    const token = generateToken(user.nomor);

    // Hapus password dari response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        user: userWithoutPassword
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get Current User
exports.me = async (req, res, next) => {
  try {
    const user = await prisma.pengguna.findUnique({
      where: { nomor: req.user.nomor },
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

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    next(error);
  }
};

// Change Password
exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password lama dan baru wajib diisi'
      });
    }

    // Ambil user dengan password
    const user = await prisma.pengguna.findUnique({
      where: { nomor: req.user.nomor }
    });

    // Cek old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Password lama salah'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.pengguna.update({
      where: { nomor: req.user.nomor },
      data: { password: hashedPassword }
    });

    res.json({
      success: true,
      message: 'Password berhasil diubah'
    });

  } catch (error) {
    next(error);
  }
};