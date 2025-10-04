// Imports
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const apiRouter = require('./routes/apiRoutes');
const connectDB = require('./config/dbConnect');
const verifyToken = require('./middleware/authMiddleware');
const aiRouter = require('./routes/aiRoutes');

// Connect DB
connectDB();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// If an explicit OPTIONS handler is required:
app.options('/{*splat}', cors()); // Express 5 syntax

// Parse JSON
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));
// Routes
app.use('/api/user', apiRouter);
app.use('/api/ai', aiRouter);

// Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
