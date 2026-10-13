import sendOtpMail from "../utils/sendOtpMail.js";
import sendContactMail from "../utils/sendContactMail.js";
import brevoMailer from "../utils/brevoMailer.js";
import { sendSuccess, sendBadRequest, sendServerError } from "../utils/response.js";

// Test OTP Email
export const testOtpEmail = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const testOtp = "123456";
        const result = await sendOtpMail(email, testOtp);
        
        return res.status(200).json({
            success: true,
            message: "Test OTP email sent successfully",
            data: { result, email, otp: testOtp }
        });
    } catch (error) {
        console.error("Test OTP Email error:", error);
        return sendServerError(res, error, "Failed to send test OTP email");
    }
};

// Test Contact Email
export const testContactEmail = async (req, res) => {
    try {
        const { 
            toEmail = "admin@nestro.com",
            senderName = "Test User", 
            senderEmail = "testuser@example.com",
            subject = "Test Contact Message",
            message = "This is a test contact form submission from the Nestro backend."
        } = req.body;

        const result = await sendContactMail({
            toEmail,
            senderName,
            senderEmail,
            subject,
            message
        });
        
        return res.status(200).json({
            success: true,
            message: "Test contact email sent successfully",
            data: { result, emailData: { toEmail, senderName, senderEmail, subject }}
        });
    } catch (error) {
        console.error("Test Contact Email error:", error);
        return sendServerError(res, error, "Failed to send test contact email");
    }
};

// Test Order Confirmation Email
export const testOrderEmail = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const testOrderDetails = {
            orderId: "NEST" + Date.now(),
            totalAmount: "15,999",
            paymentStatus: "Paid",
            address: "123 Test Street, Mumbai, Maharashtra 400001"
        };

        const result = await brevoMailer.sendOrderConfirmation(email, testOrderDetails);
        
        return res.status(200).json({
            success: true,
            message: "Test order confirmation email sent successfully",
            data: { result, email, orderDetails: testOrderDetails }
        });
    } catch (error) {
        console.error("Test Order Email error:", error);
        return sendServerError(res, error, "Failed to send test order email");
    }
};

// Test Brevo Configuration
export const testBrevoConfig = async (req, res) => {
    try {
        const config = {
            hasApiKey: !!process.env.BREVO_API_KEY,
            apiKeyPreview: process.env.BREVO_API_KEY ? 
                process.env.BREVO_API_KEY.substring(0, 10) + "..." : "Not configured",
            senderEmail: process.env.BREVO_SENDER_EMAIL || "Not configured",
            senderName: process.env.BREVO_SENDER_NAME || "Not configured"
        };

        return res.status(200).json({
            success: true,
            message: "Brevo configuration status",
            data: config
        });
    } catch (error) {
        console.error("Test Brevo Config error:", error);
        return sendServerError(res, error, "Failed to check Brevo configuration");
    }
};