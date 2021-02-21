const {Router} = require('express');
const router = Router();
const settingsController = require('../Controllers/settingsController');
const {requireAuth} = require('../middleware/authMiddleware');
const uuid = require('uuid').v4;
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'profilePics');
    },
    filename: (req, file, callback) => {
        const {originalname } = file;
        let fileName = uuid() + '-' + originalname;
        callback(null, fileName);
        if(!req.body['fileName'])
            req.body['fileName'] = [fileName];
        else
            req.body['fileName'].push(fileName);
    }
});
const upload = multer({storage});

router.get('/EditProfile', requireAuth, settingsController.get_editProfile);
router.post('/EditProfile', requireAuth, upload.single('uploadedFile'), settingsController.post_editProfile);

router.get('/changePassword', requireAuth, settingsController.get_changePassword);
router.put('/changePassword', requireAuth, settingsController.put_changePassword);

router.get('/deleteAccount', requireAuth, settingsController.get_deleteAccount);
router.delete('/deleteAccount', requireAuth, settingsController.let_deleteAccount);

module.exports = router;