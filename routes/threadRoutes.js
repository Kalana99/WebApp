const {Router} = require('express');
const router = Router();
const threadController = require('../Controllers/threadController');
const {requireAuth} = require('../middleware/authMiddleware');

router.post('/getThreadData', requireAuth, threadController.getThreadData_post);

router.post('/submitRequest', threadController.submitRequests_post);

router.post('/upload', threadController.upload_post);

router.post('/getMessages', threadController.getMessages_post);

router.post('/reply', threadController.reply_post);

router.post('/acceptOrDeclineRequest', threadController.acceptOrDeclineRequest_post);

router.get('/getUserType', requireAuth, threadController.getUserType_get);

router.post('/getStaff', threadController.getStaff_post);

module.exports = router;