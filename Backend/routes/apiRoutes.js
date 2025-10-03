const express = require('express');
const { login, register } = require('../controller/authController');
const { verifyOtp } = require('../controller/otpController');

const apiRouter = express.Router();

apiRouter.post('/login', login);
apiRouter.post('/register', register);
apiRouter.post('/verify-otp', verifyOtp);

module.exports = apiRouter;