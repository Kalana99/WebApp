const {Router} = require('express');
const router = Router();
const formController = require('../Controllers/formController');
const {requireAuth} = require('../middleware/authMiddleware');

router.post('/checkEmailExistence', formController.checkEmailExistence);



module.exports = router;