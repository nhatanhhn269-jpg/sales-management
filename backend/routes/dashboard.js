const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalCustomers,
      newCustomers,
      returningCustomers,
      vipCustomers,
      closedDeals,
      lostDeals,
      totalOrders,
      monthlyOrders,
      allOrders,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({ where: { type: 'NEW' } }),
      prisma.customer.count({ where: { type: 'RETURNING' } }),
      prisma.customer.count({ where: { type: 'VIP' } }),
      prisma.customer.count({ where: { status: 'CLOSED' } }),
      prisma.customer.count({ where: { status: 'LOST' } }),
      prisma.order.count(),
      prisma.order.findMany({ where: { orderDate: { gte: startOfMonth } } }),
      prisma.order.findMany(),
    ]);

    const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + o.amount, 0);
    const totalRevenue = allOrders.reduce((sum, o) => sum + o.amount, 0);
    const conversionRate = totalCustomers > 0
      ? Math.round((closedDeals / totalCustomers) * 100)
      : 0;

    const statusCounts = await prisma.customer.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    res.json({
      totalCustomers,
      newCustomers,
      returningCustomers,
      vipCustomers,
      closedDeals,
      lostDeals,
      totalOrders,
      monthlyRevenue,
      totalRevenue,
      conversionRate,
      statusCounts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
