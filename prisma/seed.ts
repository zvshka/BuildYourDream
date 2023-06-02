const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const seeding = async () => {
  const prisma = new PrismaClient({
    log: ['info', 'error'],
  });
  const admin = {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin1234',
  };

  const hashedPassword = await bcrypt.hash(admin.password, 10);

  const user = await prisma.user.create({
    data: {
      username: admin.username,
      email: admin.email,
      hashedPassword,
    },
  });

  await prisma?.user.update({
    where: {
      id: user.id,
    },
    data: {
      role: 'ADMIN',
    },
  });
};

seeding();
