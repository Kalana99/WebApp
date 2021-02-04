const {Router} = require('express');
const router = Router();
const formController = require('../Controllers/formController');
const {requireAuth} = require('../middleware/authMiddleware');

router.post('/checkEmailAndPassword', formController.checkEmailAndPassword);


module.exports = router;