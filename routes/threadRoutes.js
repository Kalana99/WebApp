const {Router} = require('express');
const router = Router();
const threadController = require('../Controllers/threadController');
const {requireAuth} = require('../middleware/authMiddleware');
const uuid = require('uuid').v4;
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads');
    },
    filename: (req, file, callback) => {
        const {originalname } = file;
        let fileName = uuid() + '-' + originalname;
        callback(null, fileName);
        req.body['fileName'] = fileName;
    }
});
const upload = multer({storage});

router.post('/getThreadData', requireAuth, threadController.getThreadData_post);

router.post('/submitRequest', upload.single('uploadedFile'), threadController.submitRequests_post);

router.post('/getMessages', threadController.getMessages_post);

router.post('/reply', upload.single('uploadedFile'), threadController.reply_post);

router.post('/acceptOrDeclineRequest', threadController.acceptOrDeclineRequest_post);

router.get('/getUserType', requireAuth, threadController.getUserType_get);

router.post('/getStaff', threadController.getStaff_post);

router.get('/download/:fileName', threadController.download_get);

module.exports = router;