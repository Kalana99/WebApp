const {Router} = require('express');
const router = Router();
const verificationController = require('../Controllers/verificationController');
const {requireAuth} = require('../middleware/authMiddleware');

router.get('/verify/:id', verificationController.verifyId_get);

router.get('/verifyemail/:id', verificationController.verifyEmail_get);

router.get('/sendemailagain/:id', verificationController.sendEmailAgain_get);

module.exports = router;