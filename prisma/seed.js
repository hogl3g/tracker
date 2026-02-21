const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Provide a minimal options object required by @prisma/client v7
const prisma = new PrismaClient({ log: ['error'] });

async function main() {
  console.log('Seeding database...');

  // Create admin user if not exists (use env ADMIN_EMAIL)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'dev_password';

  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    admin = await prisma.user.create({
      data: { email: adminEmail, name: 'Admin', role: 'admin' },
    });
    console.log('Created admin user:', adminEmail);
  } else {
    console.log('Admin user exists:', adminEmail);
  }

  // Seed projects from sample-projects.csv
  const csvPath = path.resolve(__dirname, '../sample-projects.csv');
  if (fs.existsSync(csvPath)) {
    const csv = fs.readFileSync(csvPath, 'utf8');
    const lines = csv.split('\n').map(l => l.trim()).filter(Boolean);
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1);

    for (const line of rows) {
      const values = line.split(',').map(v => v.trim());
      const row = {};
      headers.forEach((h, i) => (row[h] = values[i]));

      const exists = await prisma.project.findFirst({ where: { name: row.name } });
      if (exists) continue;

      try {
        await prisma.project.create({
          data: {
            name: row.name,
            address: row.address || '',
            dateStarted: row.dateStarted ? new Date(row.dateStarted) : new Date(),
            unitsPlanned: row.unitsPlanned ? parseInt(row.unitsPlanned) : 0,
            supervisor: row.supervisor || null,
            status: row.status || 'active',
          },
        });
        console.log('Inserted project:', row.name);
      } catch (e) {
        console.error('Failed to insert project:', row.name, e.message);
      }
    }
  } else {
    console.log('No sample-projects.csv found, skipping project seed.');
  }

  console.log('Seeding complete.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
