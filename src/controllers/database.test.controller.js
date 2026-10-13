import mongoose from "mongoose";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { sendSuccess, sendServerError } from "../utils/response.js";

// Test Database Connection
export const testConnection = async (req, res) => {
    try {
        const connectionState = mongoose.connection.readyState;
        const states = {
            0: 'Disconnected',
            1: 'Connected', 
            2: 'Connecting',
            3: 'Disconnecting'
        };

        const dbInfo = {
            status: states[connectionState],
            host: mongoose.connection.host,
            name: mongoose.connection.name,
            port: mongoose.connection.port,
            collections: Object.keys(mongoose.connection.collections)
        };

        return res.status(200).json({
            success: true,
            message: "Database connection status",
            data: dbInfo
        });
    } catch (error) {
        console.error("Test DB Connection error:", error);
        return sendServerError(res, error, "Failed to check database connection");
    }
};

// Test Create Operations
export const testCreate = async (req, res) => {
    try {
        const testResults = [];

        // Test Category Creation
        try {
            const timestamp = Date.now();
            const testCategory = new Category({
                name: `TestCat${timestamp}`.substring(0, 20),
                slug: `test-cat-${timestamp}`.substring(0, 20),
                image: "test-image-url.jpg"
            });
            const savedCategory = await testCategory.save();
            testResults.push({
                model: "Category",
                operation: "CREATE",
                success: true,
                data: { id: savedCategory._id, name: savedCategory.name, slug: savedCategory.slug }
            });
        } catch (error) {
            testResults.push({
                model: "Category",
                operation: "CREATE", 
                success: false,
                error: error.message
            });
        }

        // Test User Creation
        try {
            const testUser = new User({
                name: `Test User ${Date.now()}`,
                email: `testuser${Date.now()}@example.com`,
                password: "hashedpassword123", // In real app, this would be hashed
                phone: "9999999999",
                isVerified: true
            });
            const savedUser = await testUser.save();
            testResults.push({
                model: "User",
                operation: "CREATE",
                success: true,
                data: { id: savedUser._id, email: savedUser.email }
            });
        } catch (error) {
            testResults.push({
                model: "User",
                operation: "CREATE",
                success: false,
                error: error.message
            });
        }

        return res.status(200).json({
            success: true,
            message: "Database CREATE operations test completed",
            data: { results: testResults }
        });
    } catch (error) {
        console.error("Test CREATE error:", error);
        return sendServerError(res, error, "Failed to test database CREATE operations");
    }
};

// Test Read Operations
export const testRead = async (req, res) => {
    try {
        const testResults = [];

        // Test Categories Read
        try {
            const categories = await Category.find().limit(5);
            testResults.push({
                model: "Category",
                operation: "READ",
                success: true,
                data: { count: categories.length, items: categories.map(c => ({ id: c._id, name: c.name })) }
            });
        } catch (error) {
            testResults.push({
                model: "Category",
                operation: "READ",
                success: false,
                error: error.message
            });
        }

        // Test Users Read
        try {
            const users = await User.find().limit(5).select('name email createdAt');
            testResults.push({
                model: "User",
                operation: "READ",
                success: true,
                data: { count: users.length, items: users }
            });
        } catch (error) {
            testResults.push({
                model: "User",
                operation: "READ",
                success: false,
                error: error.message
            });
        }

        // Test Products Read
        try {
            const products = await Product.find().limit(3).populate('category');
            testResults.push({
                model: "Product",
                operation: "READ",
                success: true,
                data: { count: products.length, items: products.map(p => ({ id: p._id, name: p.name, category: p.category?.name })) }
            });
        } catch (error) {
            testResults.push({
                model: "Product",
                operation: "READ",
                success: false,
                error: error.message
            });
        }

        return res.status(200).json({
            success: true,
            message: "Database READ operations test completed",
            data: { results: testResults }
        });
    } catch (error) {
        console.error("Test READ error:", error);
        return sendServerError(res, error, "Failed to test database READ operations");
    }
};

// Test Database Statistics
export const testStats = async (req, res) => {
    try {
        const stats = {};

        // Get collection stats
        const collections = ['categories', 'users', 'products', 'orders', 'carts', 'colors', 'rooms', 'contacts'];
        
        for (const collection of collections) {
            try {
                const count = await mongoose.connection.db.collection(collection).countDocuments();
                stats[collection] = { count, exists: true };
            } catch (error) {
                stats[collection] = { count: 0, exists: false, error: error.message };
            }
        }

        // Database info
        const dbStats = await mongoose.connection.db.stats();
        
        return res.status(200).json({
            success: true,
            message: "Database statistics",
            data: {
                collections: stats,
                database: {
                    name: mongoose.connection.name,
                    size: `${(dbStats.dataSize / 1024 / 1024).toFixed(2)} MB`,
                    documents: dbStats.objects,
                    indexes: dbStats.indexes,
                    avgObjSize: `${(dbStats.avgObjSize || 0).toFixed(2)} bytes`
                }
            }
        });
    } catch (error) {
        console.error("Test Stats error:", error);
        return sendServerError(res, error, "Failed to get database statistics");
    }
};

// Test Database Cleanup (Remove test data)
export const testCleanup = async (req, res) => {
    try {
        const results = [];

        // Remove test categories
        try {
            const deleteResult = await Category.deleteMany({ name: { $regex: /^TestCat/ } });
            results.push({
                collection: "categories",
                deleted: deleteResult.deletedCount,
                success: true
            });
        } catch (error) {
            results.push({
                collection: "categories", 
                deleted: 0,
                success: false,
                error: error.message
            });
        }

        // Remove test users
        try {
            const deleteResult = await User.deleteMany({ email: { $regex: /^testuser.*@example\.com$/ } });
            results.push({
                collection: "users",
                deleted: deleteResult.deletedCount,
                success: true
            });
        } catch (error) {
            results.push({
                collection: "users",
                deleted: 0,
                success: false,
                error: error.message
            });
        }

        return res.status(200).json({
            success: true,
            message: "Database cleanup completed",
            data: { results }
        });
    } catch (error) {
        console.error("Test Cleanup error:", error);
        return sendServerError(res, error, "Failed to cleanup test data");
    }
};