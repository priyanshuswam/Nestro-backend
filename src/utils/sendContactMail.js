import brevoMailer from "./brevoMailer.js";

const sendContactMail = async ({ toEmail, senderName, senderEmail, subject, message }) => {
    try {
        const result = await brevoMailer.sendContactEmail({
            toEmail,
            senderName,
            senderEmail,
            subject,
            message
        });
        return result;
    } catch (error) {
        console.error("sendContactMail error:", error);
        return false;
    }
};

export default sendContactMail;