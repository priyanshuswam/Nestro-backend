import brevoMailer from "./brevoMailer.js";

const sendOtpMail = async (toEmail, otp) => {
    try {
        const result = await brevoMailer.sendOtpEmail(toEmail, otp);
        return result;
    } catch (error) {
        console.log("sendOtpMail error:", error);
        return "Error sending OTP email: " + error.message;
    }
};

export default sendOtpMail;