const express = require('express');
const { soil } = require('../controller/aiController');

const aiRouter = express.Router();


aiRouter.post('/soil', soil);

module.exports = aiRouter;