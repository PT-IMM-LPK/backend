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
      nama: 'Naufal',
      email: 'example@lpkimm.com',
      password: hashedPassword,
      nomorTelepon: '081234567890',
      tanggalLahir: new Date('10-10-2000'),
      role: 'SUPER_ADMIN',
      departemenId: departemenList.find(d => d.namaDepartemen === 'IT Department')?.nomor
    },
    {
      nama: 'Andi',
      email: 'example2@lpkimm.com',
      password: hashedPassword,
      nomorTelepon: '081234567891',
      tanggalLahir: new Date('11-11-2000'),
      role: 'ADMIN',
      departemenId: departemenList.find(d => d.namaDepartemen === 'IT Department')?.nomor
    },
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
