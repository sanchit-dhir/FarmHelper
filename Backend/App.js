//Imports
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const apiRouter = require('./routes/apiRoutes');
const connectDB = require('./config/dbConnect');
const verifyToken = require('./middleware/authMiddleware');
const aiRouter = require('./routes/aiRoutes');

//Connect to DB
connectDB()

const app = express(cors);

//Middleware
app.use(express.json());


//Routes
app.use('/api/user', apiRouter);
app.use('/api/ai', verifyToken, aiRouter);
//Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
