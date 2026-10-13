import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import { sendServerError } from "../utils/response.js";

export const protect = async (req, res, next) => {
    try {
        let token = null;
        
        // Check for token in cookies first
        if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
        }
        
        // Check for Bearer token in headers
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.API_SECRET);
        
        // Check if user still exists
        const user = await UserModel.findById(decoded.id).select("-password -otp -otpExpiry");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Token is no longer valid. User not found."
            });
        }
        
        // Check if user is verified
        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: "Please verify your email to access this resource."
            });
        }
        
        req.user = user;
        next();

    } catch (error) {
        console.log(error, "JWT verification error");
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token has expired. Please login again."
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Please login again."
            });
        }
        
        return sendServerError(res, error, "Authentication failed");
    }
}

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${roles.join(' or ')}`
            });
        }
        next();
    };
};