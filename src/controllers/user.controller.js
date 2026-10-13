import UserModel from "../models/user.model.js";
import { sendBadRequest, sendConflict, sendCreated, sendNotFound, sendServerError, sendSuccess } from "../utils/response.js";
import sendOtpMail from "../utils/sendOtpMail.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import generateToken from "../utils/generateToken.js";

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body;
        
        // Input validation
        if (!firstName || !lastName || !email || !password || !phone) {
            return sendBadRequest(res, "All fields are required");
        }
        
        if (password.length < 6) {
            return sendBadRequest(res, "Password must be at least 6 characters long");
        }

        const user = await UserModel.findOne({ email });
        if (user) return sendConflict(res, "User already exists");
        
        // Generate cryptographically secure OTP
        const otp = crypto.randomInt(100000, 999999);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        
        const mailResponse = await sendOtpMail(email, otp);
        console.log(mailResponse, "mailResponse");
        
        // Proper password hashing with bcrypt
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            otp,
            otpExpiry,
        });

        return res.status(201).json({
            user: { email },
            success: true,
            message: "User registered successfully. Please check your email for OTP verification",
        });
    } catch (error) {
        console.error(error, "error");
        sendServerError(res, error, "Internal Server Error");
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            return sendBadRequest(res, "Email and OTP are required");
        }
        
        const user = await UserModel.findOne({ email });
        if (!user) return sendNotFound(res, "User not found");
        
        // Convert to string for comparison to avoid type issues
        if (user.otp.toString() !== otp.toString()) {
            return sendBadRequest(res, "Invalid OTP");
        }
        
        if (Date.now() > user.otpExpiry) {
            return sendBadRequest(res, "OTP has expired. Please request a new one");
        }
        
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        return res.send({
            success: true,
            message: "OTP verified successfully!",
            email
        })
    } catch (error) {
        console.log(error, "error");
        sendServerError(res, error, "Internal Server Error");
    }
};

const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return sendBadRequest(res, "Email is required");
        }
        
        const user = await UserModel.findOne({ email });
        if (!user) return sendConflict(res, "User not found");
        
        // Generate cryptographically secure OTP
        const otp = crypto.randomInt(100000, 999999);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        
        const mailResponse = await sendOtpMail(email, otp);
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();
        
        return sendSuccess(res, "OTP resent successfully. Please check your email");
    } catch (error) {
        console.log(error, "error");
        sendServerError(res, error, "Internal Server Error");
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Input validation
        if (!email || !password) {
            return sendBadRequest(res, "Email and password are required");
        }
        
        const user = await UserModel.findOne({ email });
        if (!user) return sendConflict(res, "Invalid email or password");
        
        // Proper bcrypt password comparison
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return sendConflict(res, "Invalid email or password");
        
        if (!user.isVerified) return sendConflict(res, "Please verify your email before logging in");
        
        //Send Cookie
        const token = generateToken(user._id);
        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure in production
            sameSite: 'lax'
        });
        
        // Role cookie — middleware ke liye (httpOnly false taaki JS bhi read kar sake)
        res.cookie('role', user.role, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        console.log(error, "error")
        sendServerError(res, error, "Internal Server Error")
    }
}

const getProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return sendConflict(res, "User not found");

        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            user: user,
        });
    } catch (error) {
        console.log(error, "error");
        sendServerError(res, error, "Internal Server Error");
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return sendBadRequest(res, "Email is required");
        }
        
        const user = await UserModel.findOne({ email });
        if (user) {
            // Generate cryptographically secure OTP
            const otp = crypto.randomInt(100000, 999999);
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
            
            const mailResponse = await sendOtpMail(email, otp);
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            await user.save();
            
            return res.send({
                success: true,
                message: "OTP sent to your email",
                email
            })
        } else {
            // Don't reveal if email exists or not (security best practice)
            return res.send({
                success: true,
                message: "If this email exists, an OTP has been sent",
                email
            })
        }
    } catch (error) {
        console.log(error, "error");
        sendServerError(res, error, "Internal Server Error");
    }
}

const updatePassword = async (req, res) => {
    try {
        const { email, old_password, new_password } = req.body;
        
        if (!email || !new_password) {
            return sendBadRequest(res, "Email and new password are required");
        }
        
        if (new_password.length < 6) {
            return sendBadRequest(res, "New password must be at least 6 characters long");
        }
        
        const user = await UserModel.findOne({ email });
        if (!user) return sendNotFound(res, "User with this email not found");
        
        // If old password provided, verify it
        if (old_password) {
            const isOldPasswordValid = await bcrypt.compare(old_password, user.password);
            if (!isOldPasswordValid) {
                return sendConflict(res, "Old password does not match");
            }
            
            // Check if new password is same as old
            const isSamePassword = await bcrypt.compare(new_password, user.password);
            if (isSamePassword) {
                return sendConflict(res, "Old and new password cannot be same");
            }
        }
        
        // Hash new password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(new_password, saltRounds);
        user.password = hashedPassword;
        await user.save();
        
        return res.send({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        console.log(error, "error");
        sendServerError(res, error, "Internal Server Error");
    }
}

// Create admin/super_admin user (only super_admin can do this)
const createAdminUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, role } = req.body;
        if (!firstName || !lastName || !email || !password) return sendBadRequest(res, "All fields are required");
        if (!["admin", "super_admin"].includes(role)) return sendBadRequest(res, "Invalid role");
        
        if (password.length < 6) {
            return sendBadRequest(res, "Password must be at least 6 characters long");
        }

        const existing = await UserModel.findOne({ email });
        if (existing) return sendConflict(res, "User with this email already exists");

        // Proper password hashing
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const user = await UserModel.create({ 
            firstName, 
            lastName, 
            email, 
            password: hashedPassword, 
            phone, 
            role, 
            isVerified: true 
        });
        
        // Don't return password in response
        const { password: _, ...userResponse } = user.toObject();
        
        return res.status(201).json({ 
            success: true, 
            message: "Admin user created successfully", 
            user: userResponse 
        });
    } catch (error) {
        console.log(error, "error");
        sendServerError(res, error, "Internal Server Error");
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('jwt', { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'lax' 
        });
        res.clearCookie('role', { 
            httpOnly: false, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'lax' 
        });
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log(error, "error");
        sendServerError(res, error, "Internal Server Error");
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);
        if (!user) return sendNotFound(res, "User not found");
        await UserModel.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.log(error, "error");
        sendServerError(res, error, "Internal Server Error");
    }
};

const getNormalUsers = async (req, res) => {
    try {
        const users = await UserModel.find({ role: "user" }).select("-password -otp -otpExpiry");
        return res.status(200).json({ success: true, message: "Users fetched", users });
    } catch (error) {
        console.log(error, "error");
        sendServerError(res, error, "Internal Server Error");
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().select("-password -otp -otpExpiry");
        return res.status(200).json({ success: true, message: "All users fetched", users });
    } catch (error) {
        console.log(error, "error");
        sendServerError(res, error, "Internal Server Error");
    }
};

export {
    register,
    verifyOtp,
    resendOtp,
    login,
    logout,
    getProfile,
    forgotPassword,
    updatePassword,
    createAdminUser,
    getAllUsers,
    getNormalUsers,
    deleteUser,
};