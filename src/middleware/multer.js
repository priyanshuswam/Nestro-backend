import multer from "multer";
import path from "path";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// File filter for security
const fileFilter = (req, file, cb) => {
    // Allow only specific image types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and WebP files are allowed.'), false);
    }
};

// Secure local storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Generate secure filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = path.extname(file.originalname).toLowerCase();
        
        // Sanitize filename - remove any path characters
        const sanitizedName = file.fieldname.replace(/[^a-zA-Z0-9]/g, '');
        const filename = `${sanitizedName}-${timestamp}-${randomString}${fileExtension}`;
        
        cb(null, filename);
    }
});

// Configure multer with security options
const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 10 // Maximum 10 files
    }
});

// TODO: Re-enable Cloudinary after fixing package compatibility
// Alternative: Use cloudinary upload API directly after local storage
// const uploadToCloudinary = async (filePath, folder = 'products') => {
//     try {
//         const result = await cloudinary.uploader.upload(filePath, {
//             folder,
//             quality: 'auto',
//             fetch_format: 'auto'
//         });
//         
//         // Delete local file after successful upload
//         fs.unlinkSync(filePath);
//         
//         return result;
//     } catch (error) {
//         console.error('Cloudinary upload error:', error);
//         throw error;
//     }
// };

export default upload;
// export { uploadToCloudinary };