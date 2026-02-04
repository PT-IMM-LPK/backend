const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API LPK IMM',
      version: '1.0.0',
      description: 'Backend API untuk sistem LPK IMM - Vehicle Request System',
      contact: {
        name: 'PT IMM LPK',
        url: 'https://github.com/PT-IMM-LPK/backend'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Masukkan JWT token'
        }
      },
      schemas: {
        // ========== DEPARTEMEN ==========
        Departemen: {
          type: 'object',
          properties: {
            nomor: {
              type: 'integer',
              description: 'ID unik departemen (auto-increment)',
              example: 1
            },
            namaDepartemen: {
              type: 'string',
              description: 'Nama departemen',
              example: 'IT Department'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Tanggal dibuat'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Tanggal terakhir diupdate'
            }
          }
        },
        DepartemenInput: {
          type: 'object',
          required: ['namaDepartemen'],
          properties: {
            namaDepartemen: {
              type: 'string',
              description: 'Nama departemen',
              example: 'HR Department'
            }
          }
        },

        // ========== PENGGUNA ==========
        Pengguna: {
          type: 'object',
          properties: {
            nomor: {
              type: 'integer',
              description: 'ID unik pengguna (auto-increment)',
              example: 1
            },
            nama: {
              type: 'string',
              description: 'Nama lengkap pengguna',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email pengguna (unik)',
              example: 'john@example.com'
            },
            nomorTelepon: {
              type: 'string',
              description: 'Nomor telepon',
              example: '081234567890'
            },
            tanggalLahir: {
              type: 'string',
              format: 'date',
              description: 'Tanggal lahir',
              example: '1990-01-15'
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'SUPER_ADMIN'],
              description: 'Role pengguna',
              example: 'ADMIN'
            },
            departemenId: {
              type: 'integer',
              description: 'ID departemen',
              example: 1
            },
            departemen: {
              $ref: '#/components/schemas/Departemen'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        PenggunaInput: {
          type: 'object',
          required: ['nama', 'email', 'password'],
          properties: {
            nama: {
              type: 'string',
              description: 'Nama lengkap',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Password (min 6 karakter)',
              example: 'password123'
            },
            nomorTelepon: {
              type: 'string',
              description: 'Nomor telepon',
              example: '081234567890'
            },
            tanggalLahir: {
              type: 'string',
              format: 'date',
              description: 'Tanggal lahir',
              example: '1990-01-15'
            },
            departemenId: {
              type: 'integer',
              description: 'ID departemen',
              example: 1
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'SUPER_ADMIN'],
              description: 'Role pengguna',
              example: 'ADMIN'
            }
          }
        },

        // ========== AUTH ==========
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@example.com'
            },
            password: {
              type: 'string',
              example: 'password123'
            }
          }
        },
        RegisterInput: {
          type: 'object',
          required: ['nama', 'email', 'password'],
          properties: {
            nama: {
              type: 'string',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123'
            },
            nomorTelepon: {
              type: 'string',
              example: '081234567890'
            },
            tanggalLahir: {
              type: 'string',
              format: 'date',
              example: '1990-01-15'
            },
            departemenId: {
              type: 'integer',
              example: 1
            }
          }
        },
        ChangePasswordInput: {
          type: 'object',
          required: ['currentPassword', 'newPassword'],
          properties: {
            currentPassword: {
              type: 'string',
              example: 'oldpassword123'
            },
            newPassword: {
              type: 'string',
              minLength: 6,
              example: 'newpassword123'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Login berhasil'
            },
            data: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                },
                user: {
                  $ref: '#/components/schemas/Pengguna'
                }
              }
            }
          }
        },

        // ========== RESPONSES ==========
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string'
            },
            data: {
              type: 'object'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Autentikasi (Login, Register, dll)'
      },
      {
        name: 'Departemen',
        description: 'Manajemen Departemen'
      },
      {
        name: 'Pengguna',
        description: 'Manajemen Pengguna'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
