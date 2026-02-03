const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Mulai seeding database...\n');

  // ==========================================
  // SEED DEPARTEMEN
  // ==========================================
  console.log('📁 Membuat departemen...');
  
  const departemenData = [
    { namaDepartemen: 'IT Department' },
    { namaDepartemen: 'HR Department' },
    { namaDepartemen: 'Finance Department' },
    { namaDepartemen: 'Marketing Department' },
    { namaDepartemen: 'Operations Department' },
    { namaDepartemen: 'Sales Department' },
    { namaDepartemen: 'Logistics Department' },
    { namaDepartemen: 'Quality Assurance' }
  ];

  for (const dept of departemenData) {
    await prisma.departemen.upsert({
      where: { namaDepartemen: dept.namaDepartemen },
      update: {},
      create: dept
    });
  }

  const departemenList = await prisma.departemen.findMany();
  console.log(`   ✅ ${departemenList.length} departemen berhasil dibuat\n`);

  // ==========================================
  // SEED PENGGUNA
  // ==========================================
  console.log('👤 Membuat pengguna...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  const penggunaData = [
    {
      nama: 'Super Admin',
      email: 'superadmin@lpkimm.com',
      password: hashedPassword,
      nomorTelepon: '081234567890',
      tanggalLahir: new Date('1985-01-15'),
      role: 'SUPER_ADMIN',
      departemenId: departemenList.find(d => d.namaDepartemen === 'IT Department')?.nomor
    },
    {
      nama: 'Admin User',
      email: 'admin@lpkimm.com',
      password: hashedPassword,
      nomorTelepon: '081234567891',
      tanggalLahir: new Date('1988-05-20'),
      role: 'ADMIN',
      departemenId: departemenList.find(d => d.namaDepartemen === 'IT Department')?.nomor
    },
    {
      nama: 'Supervisor HR',
      email: 'supervisor.hr@lpkimm.com',
      password: hashedPassword,
      nomorTelepon: '081234567892',
      tanggalLahir: new Date('1990-03-10'),
      role: 'SUPERVISOR',
      departemenId: departemenList.find(d => d.namaDepartemen === 'HR Department')?.nomor
    },
    {
      nama: 'Supervisor Finance',
      email: 'supervisor.finance@lpkimm.com',
      password: hashedPassword,
      nomorTelepon: '081234567893',
      tanggalLahir: new Date('1987-07-25'),
      role: 'SUPERVISOR',
      departemenId: departemenList.find(d => d.namaDepartemen === 'Finance Department')?.nomor
    },
    {
      nama: 'John Doe',
      email: 'john.doe@lpkimm.com',
      password: hashedPassword,
      nomorTelepon: '081234567894',
      tanggalLahir: new Date('1995-11-08'),
      role: 'KARYAWAN',
      departemenId: departemenList.find(d => d.namaDepartemen === 'Marketing Department')?.nomor
    },
    {
      nama: 'Jane Smith',
      email: 'jane.smith@lpkimm.com',
      password: hashedPassword,
      nomorTelepon: '081234567895',
      tanggalLahir: new Date('1993-09-12'),
      role: 'KARYAWAN',
      departemenId: departemenList.find(d => d.namaDepartemen === 'Sales Department')?.nomor
    },
    {
      nama: 'Bob Wilson',
      email: 'bob.wilson@lpkimm.com',
      password: hashedPassword,
      nomorTelepon: '081234567896',
      tanggalLahir: new Date('1992-04-18'),
      role: 'KARYAWAN',
      departemenId: departemenList.find(d => d.namaDepartemen === 'Operations Department')?.nomor
    },
    {
      nama: 'Alice Brown',
      email: 'alice.brown@lpkimm.com',
      password: hashedPassword,
      nomorTelepon: '081234567897',
      tanggalLahir: new Date('1994-12-05'),
      role: 'KARYAWAN',
      departemenId: departemenList.find(d => d.namaDepartemen === 'Logistics Department')?.nomor
    }
  ];

  for (const user of penggunaData) {
    await prisma.pengguna.upsert({
      where: { email: user.email },
      update: {},
      create: user
    });
  }

  const penggunaList = await prisma.pengguna.findMany();
  console.log(`   ✅ ${penggunaList.length} pengguna berhasil dibuat\n`);

  // ==========================================
  // SUMMARY
  // ==========================================
  console.log('═══════════════════════════════════════');
  console.log('📊 SUMMARY SEEDING:');
  console.log('═══════════════════════════════════════');
  console.log(`   Departemen : ${departemenList.length}`);
  console.log(`   Pengguna   : ${penggunaList.length}`);
  console.log('═══════════════════════════════════════');
  console.log('\n🎉 Seeding selesai!\n');
  console.log('📝 Akun untuk testing:');
  console.log('   Email    : superadmin@lpkimm.com');
  console.log('   Password : password123');
  console.log('');
  console.log('   Email    : admin@lpkimm.com');
  console.log('   Password : password123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
