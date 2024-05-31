"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("@/models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Controller for user registration
const register = async (req, res) => {
    try {
        // Check if user already exists
        const existingUser = await User_1.UserModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt_1.default.hash(req.body.password, 10);
        // Create new user
        const newUser = new User_1.UserModel({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.register = register;
// Controller for user login
const login = (req, res, next) => {
    passport_1.default.authenticate('jwt', { session: false }, (error, user, info) => {
        if (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ sub: user.id }, 'your_secret_key_here', { expiresIn: '1h' });
        res.status(200).json({ token });
    })(req, res, next);
};
exports.login = login;
