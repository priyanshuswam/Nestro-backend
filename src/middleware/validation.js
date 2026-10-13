import { sendBadRequest } from "../utils/response.js";

// Email validation
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Phone validation
export const isValidPhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
    return phoneRegex.test(phone);
};

// Password validation
export const isValidPassword = (password) => {
    return password && password.length >= 6;
};

// Sanitize string input
export const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Validate required fields
export const validateRequired = (fields) => {
    return (req, res, next) => {
        const missingFields = [];
        
        for (const field of fields) {
            if (!req.body[field] || req.body[field].toString().trim() === '') {
                missingFields.push(field);
            }
        }
        
        if (missingFields.length > 0) {
            return sendBadRequest(res, `Missing required fields: ${missingFields.join(', ')}`);
        }
        
        next();
    };
};

// Validate user registration
export const validateRegistration = (req, res, next) => {
    const { firstName, lastName, email, password, phone } = req.body;
    
    if (!firstName || !lastName || !email || !password || !phone) {
        return sendBadRequest(res, "All fields are required");
    }
    
    if (!isValidEmail(email)) {
        return sendBadRequest(res, "Please provide a valid email address");
    }
    
    if (!isValidPassword(password)) {
        return sendBadRequest(res, "Password must be at least 6 characters long");
    }
    
    if (!isValidPhone(phone)) {
        return sendBadRequest(res, "Please provide a valid Indian mobile number");
    }
    
    // Sanitize inputs
    req.body.firstName = sanitizeString(firstName);
    req.body.lastName = sanitizeString(lastName);
    req.body.email = email.toLowerCase().trim();
    req.body.phone = phone.trim();
    
    next();
};

// Validate login
export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return sendBadRequest(res, "Email and password are required");
    }
    
    if (!isValidEmail(email)) {
        return sendBadRequest(res, "Please provide a valid email address");
    }
    
    req.body.email = email.toLowerCase().trim();
    next();
};

// Validate product creation
export const validateProduct = (req, res, next) => {
    const { name, description, originalPrice, salePrice, category } = req.body;
    
    if (!name || !description || !originalPrice || !category) {
        return sendBadRequest(res, "Name, description, original price, and category are required");
    }
    
    if (isNaN(originalPrice) || originalPrice <= 0) {
        return sendBadRequest(res, "Original price must be a positive number");
    }
    
    if (salePrice && (isNaN(salePrice) || salePrice <= 0)) {
        return sendBadRequest(res, "Sale price must be a positive number");
    }
    
    if (salePrice && parseFloat(salePrice) >= parseFloat(originalPrice)) {
        return sendBadRequest(res, "Sale price must be less than original price");
    }
    
    // Sanitize inputs
    req.body.name = sanitizeString(name);
    req.body.description = sanitizeString(description);
    
    next();
};

// Rate limiting helper
export const createRateLimit = (maxRequests, windowMs, message) => {
    const requests = new Map();
    
    return (req, res, next) => {
        const clientIp = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        
        // Clean old entries
        for (const [ip, data] of requests.entries()) {
            if (now - data.firstRequest > windowMs) {
                requests.delete(ip);
            }
        }
        
        const clientData = requests.get(clientIp);
        
        if (!clientData) {
            requests.set(clientIp, {
                count: 1,
                firstRequest: now
            });
            return next();
        }
        
        if (clientData.count >= maxRequests) {
            return res.status(429).json({
                success: false,
                message: message || "Too many requests. Please try again later."
            });
        }
        
        clientData.count++;
        next();
    };
};