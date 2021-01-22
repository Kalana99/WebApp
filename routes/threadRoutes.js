const {Router} = require('express');
const router = Router();
const threadController = require('../Controllers/threadController');
const {requireAuth} = require('../middleware/authMiddleware');

app.get('/getThreadData', requireAuth, threadController.getThreadData_get);