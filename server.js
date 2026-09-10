const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static UI files from the 'public' folder
app.use(express.static('public'));

// Base Route
app.get('/api-status', (req, res) => {
  res.send('SaaS Subscription Billing API Running...');
});

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const planRoutes = require('./src/routes/planRoutes');
const subscriptionRoutes = require('./src/routes/subscriptionRoutes');
const billingRoutes = require('./src/routes/billingRoutes');
//const extendedRoutes = require('./src/routes/extendedRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/billing', billingRoutes);
//app.use('/api', extendedRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/saas_billing_p17')
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});