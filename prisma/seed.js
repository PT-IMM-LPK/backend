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

  // Password format: nama (lowercase) + tanggalLahir (ddmmyyyy)
  // Naufal: naufal10102000
  // Andi: andi11112000
  
  const penggunaData = [
    {
      nama: 'Naufal',
      email: 'andrianau26@gmail.com',
      password: await bcrypt.hash('naufal26082004', 10),
      nomorTelepon: '0895413005858',
      tanggalLahir: new Date('2004-08-26'),
      role: 'SUPER_ADMIN',
      departemenId: departemenList.find(d => d.namaDepartemen === 'IT Department')?.nomor
    },
    {
      nama: 'Andi',
      email: 'example2@lpkimm.com',
      password: await bcrypt.hash('andi11112000', 10),
      nomorTelepon: '081234567891',
      tanggalLahir: new Date('2000-11-11'),
      role: 'ADMIN',
      departemenId: departemenList.find(d => d.namaDepartemen === 'IT Department')?.nomor
    },
  ];

  for (const user of penggunaData) {
    await prisma.pengguna.upsert({
      where: { email: user.email },
      update: {
        password: user.password,
        nomorTelepon: user.nomorTelepon,
        tanggalLahir: user.tanggalLahir,
        role: user.role,
        departemenId: user.departemenId,
      },
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
  console.log('📝 Akun untuk testing (Admin/SuperAdmin):');
  console.log('   Naufal (SUPER_ADMIN):');
  console.log('     Nomor Telepon : 081234567890');
  console.log('     Password      : naufal10102000');
  console.log('');
  console.log('   Andi (ADMIN):');
  console.log('     Nomor Telepon : 081234567891');
  console.log('     Password      : andi11112000');
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
