require('dotenv/config');
const express = require('express');
const cors = require('cors');
const { authenticate } = require('./middleware/auth');
const authRouter = require('./routes/auth');
const customersRouter = require('./routes/customers');
const ordersRouter = require('./routes/orders');
const dashboardRouter = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/customers', authenticate, customersRouter);
app.use('/api/orders', authenticate, ordersRouter);
app.use('/api/dashboard', authenticate, dashboardRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
