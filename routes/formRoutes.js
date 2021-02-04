const {Router} = require('express');
const router = Router();
const formController = require('../Controllers/formController');
const {requireAuth} = require('../middleware/authMiddleware');

router.post('/checkEmailExistence', formController.checkEmailExistence);

router.post('/checkPassword', formController.checkPassword);



module.exports = router;