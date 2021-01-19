const {Router} = require('express');
const router = Router();
const verificationController = require('../Controllers/verificationController');
const {requireAuth} = require('../middleware/authMiddleware');

router.get('/verify/:id', verificationController.verifyId_get);

router.get('/verifyemail/:email', verificationController.verifyEmail_get);

router.get('/sendemailagain/:email', verificationController.sendEmailAgain_get);

module.exports = router;