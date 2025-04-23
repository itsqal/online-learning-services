const courseService = require('../services/courseService');

// Create a new course
exports.createCourse = async (req, res) => {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const userId = req.user.userId;
        const { title, description } = req.body;
        const newCourse = await courseService.createCourse({ title, description, userId, token });
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await courseService.getAllCourses();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch courses. Internal server error' });
    }
};

// Create enrollment
exports.createEnrollment = async (req, res) => {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const userId = parseInt(req.user.userId, 10); 
        const courseId = parseInt(req.params.courseId, 10);

        // Check if the course exists
        const course = await courseService.getCourseById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Check if the user is already enrolled in the course
        const existingEnrollment = await courseService.checkEnrollment(userId, courseId);
        if (existingEnrollment) {
            return res.status(400).json({ error: 'User is already enrolled in this course' });
        }

        // Create enrollment
        await courseService.createEnrollment(userId, courseId, token);
        res.status(201).json({ message: 'User successfully enrolled in the course' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user's enrolled courses
exports.getUserCourses = async (req, res) => {
    try {
        const userId = req.user.userId;
        const courses = await courseService.getUserCourses(userId);
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get course detail
exports.getCourseById = async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId, 10);

        const course = await courseService.getCourseById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};