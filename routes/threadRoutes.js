const {Router} = require('express');
const router = Router();
const threadController = require('../Controllers/threadController');
const {requireAuth} = require('../middleware/authMiddleware');

router.get('/getThreadData', requireAuth, threadController.getThreadData_get);

router.post('/submitRequest', threadController.submitRequests_post);

router.post('/getMessages', threadController.getMessages_post);

router.post('/reply', threadController.reply_post);

router.post('/acceptOrDeclineRequest', threadController.acceptOrDeclineRequest_post);

router.get('/getUserType', requireAuth, threadController.getUserType_get);

router.post('/getStaff', threadController.getStaff_post);

module.exports = router;