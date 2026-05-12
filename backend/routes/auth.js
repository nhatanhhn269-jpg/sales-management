const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Thiếu username hoặc password' });
  }
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
  }
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

// Lấy danh sách users (admin only)
router.get('/users', authenticate, requireAdmin, async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, role: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });
  res.json(users);
});

// Tạo user mới (admin only)
router.post('/users', authenticate, requireAdmin, async (req, res) => {
  const { username, password, role = 'USER' } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Thiếu username hoặc password' });
  }
  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) {
    return res.status(400).json({ error: 'Username đã tồn tại' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, password: hashed, role },
    select: { id: true, username: true, role: true, createdAt: true },
  });
  res.status(201).json(user);
});

// Đổi mật khẩu (chính mình)
router.patch('/password', authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Thiếu mật khẩu hiện tại hoặc mật khẩu mới' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
  }
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng' });
  }
  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: await bcrypt.hash(newPassword, 10) },
  });
  res.json({ success: true });
});

// Xóa user (admin only, không tự xóa mình)
router.delete('/users/:id', authenticate, requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  if (id === req.user.id) {
    return res.status(400).json({ error: 'Không thể xóa tài khoản của chính mình' });
  }
  await prisma.user.delete({ where: { id } });
  res.json({ success: true });
});

module.exports = router;
