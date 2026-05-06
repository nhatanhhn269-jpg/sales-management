const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

function getCustomerType(orderCount, totalAmount) {
  if (orderCount === 0) return 'NEW';
  if (totalAmount >= 10000000) return 'VIP';
  if (orderCount >= 2) return 'RETURNING';
  return 'OLD';
}

router.get('/', async (req, res) => {
  try {
    const { status, type, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
      ];
    }
    const customers = await prisma.customer.findMany({
      where,
      include: { orders: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: Number(req.params.id) },
      include: { orders: true },
    });
    if (!customer) return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, phone, email, source, notes } = req.body;
    const customer = await prisma.customer.create({
      data: { name, phone, email, source, notes, type: 'NEW', status: 'NEW' },
    });
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, phone, email, source, notes } = req.body;
    const customer = await prisma.customer.update({
      where: { id: Number(req.params.id) },
      data: { name, phone, email, source, notes },
    });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const customer = await prisma.customer.update({
      where: { id: Number(req.params.id) },
      data: { status },
    });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.customer.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Đã xóa khách hàng' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
