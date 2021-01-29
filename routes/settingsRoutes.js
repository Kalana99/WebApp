const {Router} = require('express');
const router = Router();
const settingsController = require('../Controllers/settingsController');
const {requireAuth} = require('../middleware/authMiddleware');

router.get('/editProfile', requireAuth, settingsController.get_editProfile);

router.get('/changePassword', requireAuth, settingsController.get_changePassword);
router.put('/changePassword', requireAuth, settingsController.put_changePassword);

router.get('/deleteAccount', requireAuth, settingsController.get_deleteAccount);
router.delete('/deleteAccount', requireAuth, settingsController.let_deleteAccount);

module.exports = router;