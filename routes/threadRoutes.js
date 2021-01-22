const {Router} = require('express');
const router = Router();
const threadController = require('../Controllers/threadController');
const {requireAuth} = require('../middleware/authMiddleware');

router.get('/getThreadData', threadController.getThreadData_get);

module.exports = router;