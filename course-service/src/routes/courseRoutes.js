const express = require('express');
const courseController = require('../controllers/courseController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware, courseController.createCourse);
router.post('/enroll/:courseId', authMiddleware, courseController.createEnrollment);

router.get('/user', authMiddleware, courseController.getUserCourses);
router.get('/:courseId', authMiddleware, courseController.getCourseById);
router.get('/', authMiddleware, courseController.getAllCourses); 

module.exports = router;