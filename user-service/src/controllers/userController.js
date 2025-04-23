const userService = require('../services/userService');
const axios = require('axios');

// Register
exports.createUser = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        const newUser = await userService.createUser({ email, password, name, role });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: `Failed to create user ${error}` });
    }
};

// Login
exports.authenticateUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await userService.authenticateUser(email, password);
        res.json({ token, user });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

// Get user profile
exports.getUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        const user = await userService.getUser(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: `Failed to fetch user ${error}` });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// Get all available courses
exports.getAllCourses = async (req, res) => {
    try {
        const courseServiceUrl = process.env.COURSE_SERVICE_URL;
        const response = await axios.get(`${courseServiceUrl}`, {
            headers: {
                Authorization: req.headers['authorization'] 
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch available courses' });
    }
};