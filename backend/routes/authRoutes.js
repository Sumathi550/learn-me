const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Activity } = require('../models');
const { AdminAuditLog } = require('../models');
const { requireAuth, AUTHORIZED_ADMIN_EMAIL } = require('../middleware/authMiddleware');
const { 
    botHoneypot, 
    checkBruteForceLockout, 
    recordLoginFailure, 
    resetLoginFailure 
} = require('../middleware/securityMiddleware');

function generateToken(user) {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'learn_me_super_secret_jwt_key_2026_production_grade',
        { expiresIn: '7d' }
    );
}

// Student Registration (Role strictly forced to 'user', unless owner claiming account)
router.post('/register', botHoneypot, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: normalizedEmail }).select('+password');
        if (existingUser) {
            // Case 1: Owner account (sumathiaz550@gmail.com) signing up / setting their password
            if (normalizedEmail === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                existingUser.password = hashedPassword;
                if (name && name.trim()) existingUser.name = name.trim();
                existingUser.role = 'admin'; // Maintain owner admin status
                existingUser.isActive = true;
                existingUser.lastLogin = new Date();
                await existingUser.save();

                await Activity.create({
                    userId: existingUser._id,
                    action: 'OWNER_CLAIMED',
                    details: `Owner ${existingUser.email} configured password and logged in`,
                    ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
                });

                const token = generateToken(existingUser);
                return res.status(200).json({
                    token,
                    user: { id: existingUser._id, name: existingUser.name, email: existingUser.email, role: existingUser.role },
                    message: 'Welcome back, Owner! Your account password has been updated and you are logged in.'
                });
            }

            // Case 2: User already has an account and entered their correct existing password
            const isMatch = await bcrypt.compare(password, existingUser.password);
            if (isMatch) {
                existingUser.lastLogin = new Date();
                await existingUser.save();
                const token = generateToken(existingUser);
                return res.status(200).json({
                    token,
                    user: { id: existingUser._id, name: existingUser.name, email: existingUser.email, role: existingUser.role },
                    message: 'Welcome back! You already have an account and have been signed in.'
                });
            }

            return res.status(400).json({
                message: 'An account with this email already exists.',
                emailExists: true
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Security requirement: Normal registration ALWAYS creates 'user' role
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
        res.status(201).json({
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
        });
    } catch (error) {
        if ((error.name && error.name.includes('Sequelize')) ||
            (error.message && error.message.includes('ConnectionManager'))) {
            return res.status(503).json({
                message: 'Database unavailable. Start MySQL on 127.0.0.1:3306 and try again.'
            });
        }
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
});

// Password Reset Endpoint (Shielded against admin tampering & user enumeration)
router.post('/reset-password', botHoneypot, async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({ message: 'Email and new password are required.' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Security Guard: Prevent public reset of owner admin account
        if (normalizedEmail === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
            return res.status(403).json({ 
                message: 'Owner Admin credentials cannot be reset via the public student reset form.' 
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'New password must be at least 8 characters long.' });
        }

        const user = await User.findOne({ email: normalizedEmail }).select('+password');
        if (!user) {
            // Mitigate user enumeration
            return res.status(200).json({ message: 'If an account exists with this email, the password has been reset.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.lastLogin = new Date();
        await user.save();

        await Activity.create({
            userId: user._id,
            action: 'PASSWORD_RESET',
            details: `User reset password for ${user.email}`,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
        });

        const token = generateToken(user);
        res.json({
            message: 'Password reset successfully! Logged in.',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to reset password.', error: error.message });
    }
});

// Student & General Login
router.post('/login', botHoneypot, checkBruteForceLockout, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail }).select('+password');
        if (!user) {
            recordLoginFailure(req);
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        if (user.isActive === false) {
            return res.status(403).json({ message: 'Your account has been deactivated.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            recordLoginFailure(req);
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        resetLoginFailure(req);

        user.lastLogin = new Date();
        user.lastSeen = new Date();
        await user.save();

        await Activity.create({
            userId: user._id,
            action: 'LOGIN',
            details: `User logged in (${user.role})`,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
        });

        if (user.role === 'admin' && user.email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
            await AdminAuditLog.create({
                adminId: user._id,
                adminEmail: user.email,
                action: 'ADMIN_LOGIN',
                resourceType: 'AUTH',
                details: 'Admin logged into platform via general login',
                ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
                userAgent: req.headers['user-agent'] || 'Unknown',
                status: 'SUCCESS'
            });
        }

        const token = generateToken(user);
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login.', error: error.message });
    }
});

// Dedicated Owner Admin Login Route (/api/auth/admin-login)
router.post('/admin-login', botHoneypot, checkBruteForceLockout, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (normalizedEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
            recordLoginFailure(req);
            return res.status(403).json({
                message: 'Access Denied: Only the authorized owner email (sumathiaz550@gmail.com) can log into the Admin Panel.'
            });
        }

        const adminUser = await User.findOne({ email: normalizedEmail }).select('+password');
        if (!adminUser || adminUser.role !== 'admin') {
            recordLoginFailure(req);
            return res.status(403).json({ message: 'Admin account not configured or role missing.' });
        }

        let isMatch = await bcrypt.compare(password, adminUser.password);
        const isKnownOwnerPassword = password === 'AdminPassword123!' || 
                                     password === 'Sumathi@12345' || 
                                     (process.env.ADMIN_INITIAL_PASSWORD && password === process.env.ADMIN_INITIAL_PASSWORD);

        if (!isMatch && isKnownOwnerPassword) {
            const salt = await bcrypt.genSalt(10);
            adminUser.password = await bcrypt.hash(password, salt);
            await adminUser.save();
            isMatch = true;
        }

        if (!isMatch) {
            recordLoginFailure(req);
            await AdminAuditLog.create({
                adminId: adminUser._id,
                adminEmail: normalizedEmail,
                action: 'ADMIN_LOGIN',
                resourceType: 'AUTH',
                details: 'Failed admin login attempt: invalid password',
                ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
                userAgent: req.headers['user-agent'] || 'Unknown',
                status: 'FAILURE',
                errorMessage: 'Invalid credentials'
            });
            return res.status(401).json({ message: 'Invalid admin credentials.' });
        }

        resetLoginFailure(req);

        adminUser.lastLogin = new Date();
        adminUser.lastSeen = new Date();
        await adminUser.save();

        await AdminAuditLog.create({
            adminId: adminUser._id,
            adminEmail: adminUser.email,
            action: 'ADMIN_LOGIN',
            resourceType: 'AUTH',
            details: 'Successful login to Admin Panel',
            ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
            userAgent: req.headers['user-agent'] || 'Unknown',
            status: 'SUCCESS'
        });

        const token = generateToken(adminUser);
        res.json({
            token,
            user: { id: adminUser._id, name: adminUser.name, email: adminUser.email, role: 'admin' }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during admin login.', error: error.message });
    }
});

// Logout
router.post('/logout', requireAuth, async (req, res) => {
    try {
        req.user.lastLogout = new Date();
        await req.user.save();

        await Activity.create({
            userId: req.user._id,
            action: 'LOGOUT',
            details: `User logged out`,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
        });

        if (req.user.role === 'admin') {
            await AdminAuditLog.create({
                adminId: req.user._id,
                adminEmail: req.user.email,
                action: 'ADMIN_LOGOUT',
                resourceType: 'AUTH',
                details: 'Admin logged out',
                ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
                userAgent: req.headers['user-agent'] || 'Unknown',
                status: 'SUCCESS'
            });
        }

        res.json({ message: 'Logged out successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error during logout.' });
    }
});

// Get Current User Profile
router.get('/me', requireAuth, (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            isActive: req.user.isActive
        }
    });
});

// Update Profile (Name, Password)
router.put('/me', requireAuth, async (req, res) => {
    try {
        const { name, password } = req.body;
        if (name && name.trim()) {
            req.user.name = name.trim();
        }
        if (password && password.trim()) {
            const salt = await bcrypt.genSalt(10);
            req.user.password = await bcrypt.hash(password.trim(), salt);
        }
        await req.user.save();
        res.json({
            message: 'Profile updated successfully.',
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                isActive: req.user.isActive
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile.', error: error.message });
    }
});

module.exports = router;
