/**
 * Learn Me - Auth Controller
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Activity } = require('../models');
const { AUTHORIZED_ADMIN_EMAIL } = require('../middleware/authMiddleware');
const { sendSuccess, sendError } = require('../utils/response');

function generateToken(user) {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'learn_me_super_secret_jwt_key_2026_production_grade',
        { expiresIn: '7d' }
    );
}

async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return sendError(res, 'Name, email, and password are required.', 400);
        }

        if (password.length < 8) {
            return sendError(res, 'Password must be at least 8 characters long.', 400);
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: normalizedEmail }).select('+password');

        if (existingUser) {
            // Owner claiming password
            if (normalizedEmail === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                existingUser.password = hashedPassword;
                if (name && name.trim()) existingUser.name = name.trim();
                existingUser.role = 'admin';
                existingUser.isActive = true;
                existingUser.lastLogin = new Date();
                await existingUser.save();

                const token = generateToken(existingUser);
                return sendSuccess(res, {
                    token,
                    user: { id: existingUser._id, name: existingUser.name, email: existingUser.email, role: existingUser.role }
                }, 'Owner credentials verified and logged in.');
            }

            const isMatch = await bcrypt.compare(password, existingUser.password);
            if (isMatch) {
                existingUser.lastLogin = new Date();
                await existingUser.save();
                const token = generateToken(existingUser);
                return sendSuccess(res, {
                    token,
                    user: { id: existingUser._id, name: existingUser.name, email: existingUser.email, role: existingUser.role }
                }, 'Signed in with existing account.');
            }

            return sendError(res, 'An account with this email already exists.', 400, { emailExists: true });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: 'user',
            isActive: true,
            lastLogin: new Date()
        });

        await Activity.create({
            userId: newUser._id,
            action: 'REGISTRATION',
            details: `Registered as a new student (${newUser.email})`,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
        });

        const token = generateToken(newUser);
        return sendSuccess(res, {
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
        }, 'Account created successfully', 201);
    } catch (err) {
        return sendError(res, 'Registration failed.', 500, { error: err.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return sendError(res, 'Email and password are required.', 400);
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail }).select('+password');

        if (!user) {
            return sendError(res, 'Invalid email or password.', 401);
        }

        if (user.isActive === false) {
            return sendError(res, 'Your account has been deactivated. Please contact support.', 403);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendError(res, 'Invalid email or password.', 401);
        }

        user.lastLogin = new Date();
        await user.save();

        await Activity.create({
            userId: user._id,
            action: 'LOGIN',
            details: `User logged in (${user.role})`,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
        });

        const token = generateToken(user);
        return sendSuccess(res, {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }, 'Signed in successfully');
    } catch (err) {
        return sendError(res, 'Login failed.', 500, { error: err.message });
    }
}

async function me(req, res) {
    return sendSuccess(res, {
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            createdAt: req.user.createdAt
        }
    }, 'Session active');
}

async function logout(req, res) {
    return sendSuccess(res, {}, 'Logged out successfully');
}

module.exports = {
    register,
    login,
    me,
    logout
};
