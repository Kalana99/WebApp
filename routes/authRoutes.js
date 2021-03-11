const {Router} = require('express');
const router = Router();
const authController = require('../Controllers/authController');
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

router.get('/', authController.home_get);

router.get('/signup', authController.signup_get);

router.post('/signup', upload.single('uploadedFile'), authController.signup_post);

router.get('/login', authController.login_get);

router.post('/login', authController.login_post);

router.get('/contact', authController.contacts_get);

router.post('/contact', authController.contact_post);

router.get('/forgotPassword', authController.forgotPassword_get);

router.post('/getEmailandPin', authController.forgotPassword_checkPost);

router.get('/forgotChangePsw', authController.ForgotPassword_change_get);

router.put('/forgotChangePsw', authController.ForgotPassword_change_put);

router.get('/userprofile', requireAuth,  authController.userprofile_get);

router.get('/getProfilePic', authController.get_profilePic);

router.get('/logout', authController.logout_get);

router.get('/threads', requireAuth, authController.threads_get);

router.get('/getUserId', requireAuth, authController.getUserId_get);

module.exports = router;