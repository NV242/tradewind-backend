const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// 1. Security Headers (Helmet)
app.use(helmet());

// 2. CORS Configuration (HERE IS THE UPDATE)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// 3. Body Parser (Allows server to read JSON bodies)
app.use(express.json());

// 4. API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/shipments', require('./routes/shipmentRoutes'));
app.use('/api/telemetry', require('./routes/telemetryRoutes'));

// 5. Health Check Route
app.get('/', (req, res) => {
  res.send('TradeWind Logistics API Engine is Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 TradeWind Engine running on port ${PORT}`);
});