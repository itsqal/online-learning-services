const prisma = require('../config/prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

exports.createUser = async (userData) => {
    const { email, password, name, role } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role,
        },
    });

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
    }
};

exports.authenticateUser = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt
        },
        token: token
    };
};

exports.getAllUsers = async () => {
    const users = await prisma.user.findMany();

    return {
        users: users.map(user => ({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt
        }))
    }
};

exports.getUser = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new Error('User not found');
    }

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
    }
};

exports.getUserCourses = async (userId) => {
    // Fetch user data from the database
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new Error('User not found');
    }

    // Call the course service API to get the courses for the user
    const courseServiceUrl = process.env.COURSE_SERVICE_URL;
    let courses = [];
    try {
        const response = await axios.get(`${courseServiceUrl}/user`);
        courses = response.data;
    } catch (error) {
        throw new Error('Failed to fetch courses from the course service');
    }

    // Return the courses along with the user's data
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt
        },
        courses: courses.map(course => ({
            courseId: course.id,
            courseName: course.title,
            courseDescription: course.description,
            courseInsructor: course.instructorName,
            currentCourseEnrollment: course.currentEnrollments,
            progress: course.progress,
            openedAt: course.createdAt,
        }))
    };
};

exports.enrollToCourse = async (userId, courseId) => {
    // Validate the user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new Error('User not found');
    }

    // Call the course service API to enroll the user in the course
    const courseServiceUrl = process.env.COURSE_SERVICE_URL;
    try {
        const response = await axios.post(`${courseServiceUrl}/enroll`, {
            userId,
            courseId
        });

        return response.data; // Return the response from the course service
    } catch (error) {
        throw new Error('Failed to enroll user in the course');
    }
};
