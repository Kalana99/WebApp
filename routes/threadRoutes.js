const {Router} = require('express');
const router = Router();
const threadController = require('../Controllers/threadController');
const {requireAuth} = require('../middleware/authMiddleware');

applicationCache.get('/getThreadData', requireAuth, threadController.getThreadData_get);