import mongoose from "mongoose";

export const connectDB = async () => {
    // Check for MongoDB URI environment variable
    const mongodbUri = process.env.MONGODB_URI;
    
    if (!mongodbUri) {
        console.error("❌ MONGODB_URI environment variable is required");
        console.error("📝 Set MONGODB_URI in your environment or .env file");
        console.error("🔗 Example: mongodb+srv://user:password@cluster.mongodb.net/nestro");
        process.exit(1);
    }

    try {
        // Configure mongoose connection options
        const options = {
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        };

        await mongoose.connect(mongodbUri, options);
        
        console.log("✅ Database connected successfully");
        console.log(`🔗 Connected to: ${mongodbUri.replace(/\/\/.*@/, '//<credentials>@')}`);
        
        return true;

    } catch (error) {
        console.error("❌ Database connection failed:");
        console.error(`   Error: ${error.message}`);
        
        if (error.message.includes('ECONNREFUSED')) {
            console.error("🔍 Connection refused - check if MongoDB URI is correct");
        } else if (error.message.includes('authentication')) {
            console.error("🔍 Authentication failed - check username/password");
        } else if (error.message.includes('timeout')) {
            console.error("🔍 Connection timeout - check network connectivity");
        }
        
        process.exit(1);
    }
}