const {Router} = require('express');
const router = Router();
const threadController = require('../Controllers/threadController');
const {requireAuth} = require('../middleware/authMiddleware');

router.get('/getThreadData', requireAuth, threadController.getThreadData_get);

router.post('/submitRequest', threadController.submitRequests_post);

module.exports = router;