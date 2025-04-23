const express = require('express');
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { authorizationMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', userController.createUser);
router.post('/login', userController.authenticateUser);

router.get('/courses', authMiddleware, userController.getAllCourses);
router.get('/:userId', authMiddleware, userController.getUser);

module.exports = router;