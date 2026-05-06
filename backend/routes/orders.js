const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

async function updateCustomerType(customerId) {
  const orders = await prisma.order.findMany({ where: { customerId } });
  const orderCount = orders.length;
  const totalAmount = orders.reduce((sum, o) => sum + o.amount, 0);

  let type = 'NEW';
  if (orderCount === 0) type = 'NEW';
  else if (totalAmount >= 10000000) type = 'VIP';
  else if (orderCount >= 2) type = 'RETURNING';
  else type = 'OLD';

  await prisma.customer.update({ where: { id: customerId }, data: { type } });
}

router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { customer: true },
      orderBy: { orderDate: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/customer/:customerId', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: Number(req.params.customerId) },
      orderBy: { orderDate: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { customerId, amount, product, notes, orderDate } = req.body;
    const order = await prisma.order.create({
      data: {
        customerId: Number(customerId),
        amount: Number(amount),
        product,
        notes,
        orderDate: orderDate ? new Date(orderDate) : new Date(),
      },
    });
    await updateCustomerType(Number(customerId));
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: Number(req.params.id) } });
    await prisma.order.delete({ where: { id: Number(req.params.id) } });
    await updateCustomerType(order.customerId);
    res.json({ message: 'Đã xóa đơn hàng' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
