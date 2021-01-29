const {Router} = require('express');
const router = Router();
const settingsController = require('../Controllers/settingsController');

router.get('/editProfile', settingsController.get_editProfile);

router.get('/changePassword', settingsController.get_changePassword);
router.put('/changePassword', settingsController.put_changePassword);

router.get('/deleteAccount', settingsController.get_deleteAccount);
router.delete('/deleteAccount', settingsController.let_deleteAccount);

module.exports = router;