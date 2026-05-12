const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Tạo admin mặc định nếu chưa có
  const adminExists = await prisma.user.findUnique({ where: { username: 'admin' } });
  if (!adminExists) {
    await prisma.user.create({
      data: {
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),
        role: 'ADMIN',
      },
    });
    console.log('Đã tạo tài khoản admin (username: admin, password: admin123)');
  }

  const customers = [
    { name: 'Nguyễn Thị An', phone: '0901234567', email: 'an@gmail.com', source: 'Facebook', status: 'CLOSED', type: 'VIP' },
    { name: 'Trần Văn Bình', phone: '0912345678', source: 'Zalo', status: 'CONSULTING', type: 'NEW' },
    { name: 'Lê Thị Cúc', phone: '0923456789', source: 'Giới thiệu', status: 'QUOTED', type: 'OLD' },
    { name: 'Phạm Minh Đức', phone: '0934567890', source: 'Facebook', status: 'NEW', type: 'NEW' },
    { name: 'Hoàng Thị Em', phone: '0945678901', source: 'Website', status: 'CLOSED', type: 'RETURNING' },
    { name: 'Vũ Văn Phong', phone: '0956789012', source: 'Zalo', status: 'LOST', type: 'OLD' },
  ];

  for (const c of customers) {
    await prisma.customer.create({ data: c });
  }

  await prisma.order.createMany({
    data: [
      { customerId: 1, product: 'Gói Premium', amount: 15000000, orderDate: new Date('2026-01-15') },
      { customerId: 1, product: 'Gia hạn 1 năm', amount: 8000000, orderDate: new Date('2026-04-10') },
      { customerId: 3, product: 'Gói Basic', amount: 3000000, orderDate: new Date('2026-03-20') },
      { customerId: 5, product: 'Gói Standard', amount: 5000000, orderDate: new Date('2026-02-28') },
      { customerId: 5, product: 'Add-on tính năng', amount: 2000000, orderDate: new Date('2026-04-15') },
    ],
  });

  console.log('Seed thành công!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
