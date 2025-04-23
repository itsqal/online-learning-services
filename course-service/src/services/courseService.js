const prisma = require('../config/prismaClient');
const axios = require('axios');

exports.createCourse = async (courseData) => {
    const { title, description, userId, token } = courseData;
    const userServiceUrl = process.env.USER_SERVICE_URL;

    let user;

    try {
        const response = await axios.get(`${userServiceUrl}/${userId}`, {
            headers: {
                Authorization: token,
            },
        }
        );
        user = response.data;

        if (!user || user.role !== 'instructor') {
            throw new Error('User not found or not an instructor');
        }
    } catch (error) {
        throw new Error(error.message);
    }

    const course = await prisma.course.create({
        data: {
            title,
            description,
            instructorId: userId,
        }
    });

    return {
        id: course.id,
        title: course.title,
        description: course.description,
        instructorName: user.name,
        createdAt: course.createdAt,
    };
};

exports.getAllCourses = async () => {
    const courses = await prisma.course.findMany({});

    return courses.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        instructorName: course.instructorId,
        createdAt: course.createdAt,
    }));
}

exports.getUserCourses = async (userId) => {
    try {
        const enrollments = await prisma.enrollment.findMany({
            where: { studentId: userId },
            include: {
                course: true,
            },
        });

        const courses = enrollments.map((enrollment) => {
            const { course } = enrollment;
            return {
                id: course.id,
                title: course.title,
                description: course.description,
                createdAt: course.createdAt,
            };
        });

        return courses;
    } catch (error) {
        throw new Error(error);
    }
};

exports.createEnrollment = async (userId, courseId, token) => {
    const userServiceUrl = process.env.USER_SERVICE_URL;

    try {
        const response = await axios.get(`${userServiceUrl}/${userId}`, {
            headers: {
                Authorization: token,
            },
        });
        user = response.data;

        if (!user || user.role !== 'student') {
            throw new Error('User not found or not a student');
        }

        await prisma.student.upsert({
            where: { id: userId },
            update: {},
            create: {
                id: userId,
                name: user.name,
            },
        });
    } catch (error) {
        throw new Error(error.message);
    }

    const enrollment = await prisma.enrollment.create({
        data: {
            studentId: userId,
            courseId: courseId,
        }
    });

    return enrollment;
}

exports.getCourseById = async (courseId) => {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            enrollments: {
                include: {
                    student: true,
                },
            },
        },
    });

    if (!course) {
        throw new Error('Course not found');
    }

    return {
        id: course.id,
        title: course.title,
        description: course.description,
        createdAt: course.createdAt,
        students: course.enrollments.map((enrollment) => ({
            id: enrollment.student.id,
            name: enrollment.student.name,
        })),
    };
};

exports.checkEnrollment = async (userId, courseId) => {
    const enrollment = await prisma.enrollment.findFirst({
        where: {
            studentId: userId,
            courseId: courseId,
        },
    });

    return enrollment !== null;
}