import fetch from 'node-fetch';

class BrevoMailer {
    constructor() {
        this.apiKey = process.env.BREVO_API_KEY;
        this.baseURL = 'https://api.brevo.com/v3';
        
        this.defaultSender = {
            name: process.env.BREVO_SENDER_NAME || "Nestro Furniture",
            email: process.env.BREVO_SENDER_EMAIL || "noreply@nestro.com"
        };

        // Validate configuration
        if (!this.apiKey) {
            console.warn('⚠️  BREVO_API_KEY not configured. Email functionality will not work.');
        }
    }

    async makeRequest(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'api-key': this.apiKey
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Brevo API Error: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Brevo API Request failed:', error);
            throw error;
        }
    }

    async sendOtpEmail(toEmail, otp) {
        try {
            const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nestro OTP</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F8F5F1; font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .container { max-width: 520px; margin: 40px auto; padding: 32px 28px; background: #FFFFFF; border-radius: 16px; border: 1px solid #E8E0D5; box-shadow: 0 8px 24px rgba(44, 32, 22, 0.08); text-align: center; }
    .logo { font-size: 22px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #1E1E1E; margin-bottom: 8px; }
    .logo span { color: #8B5E3C; }
    .divider { width: 60px; height: 2px; background: #C6A27E; margin: 16px auto 24px; }
    .greeting { font-size: 16px; color: #1E1E1E; font-weight: 500; margin-bottom: 6px; }
    .sub { font-size: 14px; color: #6B7280; margin-bottom: 24px; }
    .otp-box { background: #F5EDE4; border-radius: 12px; padding: 16px 20px; display: inline-block; margin: 8px 0 24px; letter-spacing: 4px; font-size: 40px; font-weight: 600; color: #2C2016; font-family: 'Geist Mono', 'Courier New', monospace; border: 1px solid #D6BFA7; min-width: 200px; }
    .info { font-size: 13px; color: #6B7280; line-height: 1.6; margin-bottom: 28px; }
    .footer { font-size: 12px; color: #9CA3AF; border-top: 1px solid #E8E0D5; padding-top: 20px; margin-top: 8px; }
    .footer a { color: #8B5E3C; text-decoration: none; }
    .badge { background: #EAF3DE; color: #3B6D11; font-size: 11px; padding: 2px 12px; border-radius: 20px; display: inline-block; margin-bottom: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Nestro<span>.</span></div>
    <div class="divider"></div>

    <div class="badge">🔒 Secure Verification</div>
    <h1 class="greeting">One‑Time Password</h1>
    <p class="sub">Use the code below to verify your account</p>

    <div class="otp-box">${otp}</div>

    <p class="info">
      This OTP is valid for <strong>10 minutes</strong>.<br />
      If you didn't request this, you can safely ignore this email.
    </p>

    <div class="footer">
      <p style="margin: 0 0 4px;">Need help? <a href="mailto:support@nestro.in">support@nestro.in</a></p>
      <p style="margin: 0;">&copy; 2026 Nestro. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
            `;

            const emailData = {
                sender: this.defaultSender,
                to: [{ email: toEmail }],
                subject: "OTP Verification - Nestro",
                htmlContent: htmlContent,
            };

            const response = await this.makeRequest('/smtp/email', emailData);
            console.log('✅ Brevo OTP email sent successfully:', response.messageId);
            return "OTP Email sent successfully via Brevo";
        } catch (error) {
            console.error('❌ Brevo OTP email error:', error.message);
            return "Error sending OTP email: " + error.message;
        }
    }

    async sendContactEmail({ toEmail, senderName, senderEmail, subject, message }) {
        try {
            const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body { margin:0; padding:0; background:#F8F5F1; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; }
    .container { max-width:560px; margin:40px auto; background:#fff; border-radius:16px; border:1px solid #E8E0D5; overflow:hidden; }
    .header { background:#2C2016; padding:24px 28px; }
    .logo { font-size:20px; font-weight:500; letter-spacing:0.12em; text-transform:uppercase; color:#FAF7F4; }
    .logo span { color:#C6A27E; }
    .badge { display:inline-block; background:#C6A27E; color:#2C2016; font-size:11px; font-weight:600; padding:3px 10px; border-radius:20px; margin-top:8px; }
    .body { padding:28px; }
    .title { font-size:18px; font-weight:600; color:#1E1E1E; margin-bottom:4px; }
    .sub { font-size:13px; color:#6B7280; margin-bottom:20px; }
    .row { display:flex; gap:8px; margin-bottom:10px; }
    .label { font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:#8B5E3C; width:80px; flex-shrink:0; padding-top:2px; }
    .value { font-size:13px; color:#1E1E1E; font-weight:500; }
    .msg-box { background:#F8F5F1; border:1px solid #E8E0D5; border-radius:10px; padding:16px; margin-top:16px; font-size:13px; color:#444; line-height:1.7; white-space:pre-wrap; }
    .footer { background:#F8F5F1; border-top:1px solid #E8E0D5; padding:16px 28px; font-size:11px; color:#9CA3AF; text-align:center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Nestro<span>.</span></div>
      <div class="badge">📬 New Contact Message</div>
    </div>
    <div class="body">
      <div class="title">New message received</div>
      <div class="sub">Someone submitted the contact form on your website.</div>

      <div class="row"><div class="label">Name</div><div class="value">${senderName}</div></div>
      <div class="row"><div class="label">Email</div><div class="value"><a href="mailto:${senderEmail}" style="color:#8B5E3C;">${senderEmail}</a></div></div>
      <div class="row"><div class="label">Subject</div><div class="value">${subject}</div></div>

      <div class="msg-box">${message}</div>
    </div>
    <div class="footer">Nestro Furniture · Contact Form Submission · ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
  </div>
</body>
</html>`;

            const emailData = {
                sender: this.defaultSender,
                to: [{ email: toEmail }],
                replyTo: { email: senderEmail, name: senderName },
                subject: `[Contact] ${subject} — ${senderName}`,
                htmlContent: htmlContent,
            };

            const response = await this.makeRequest('/smtp/email', emailData);
            console.log('✅ Brevo contact email sent successfully:', response.messageId);
            return true;
        } catch (error) {
            console.error('❌ Brevo contact email error:', error.message);
            return false;
        }
    }

    async sendOrderConfirmation(toEmail, orderDetails) {
        try {
            const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body { margin:0; padding:0; background:#F8F5F1; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; }
    .container { max-width:580px; margin:32px auto; background:#fff; border-radius:16px; border:1px solid #E8E0D5; overflow:hidden; }
    .header { background:#2C2016; padding:28px; text-align:center; }
    .logo { font-size:22px; font-weight:500; letter-spacing:0.12em; text-transform:uppercase; color:#FAF7F4; }
    .logo span { color:#C6A27E; }
    .badge { display:inline-block; background:#28a745; color:#fff; font-size:11px; font-weight:600; padding:4px 12px; border-radius:20px; margin-top:12px; }
    .body { padding:32px; }
    .title { font-size:20px; font-weight:600; color:#1E1E1E; margin-bottom:6px; }
    .sub { font-size:14px; color:#6B7280; margin-bottom:24px; }
    .order-info { background:#F8F5F1; border-radius:12px; padding:20px; margin:20px 0; }
    .order-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #E8E0D5; }
    .order-row:last-child { border-bottom:none; }
    .label { font-size:12px; color:#6B7280; text-transform:uppercase; letter-spacing:0.1em; }
    .value { font-size:14px; color:#1E1E1E; font-weight:500; }
    .footer { background:#F8F5F1; padding:20px 32px; text-align:center; font-size:12px; color:#9CA3AF; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Nestro<span>.</span></div>
      <div class="badge">✅ Order Confirmed</div>
    </div>
    <div class="body">
      <div class="title">Thank you for your order!</div>
      <div class="sub">We've received your order and will process it shortly.</div>

      <div class="order-info">
        <div class="order-row">
          <div class="label">Order ID</div>
          <div class="value">${orderDetails.orderId}</div>
        </div>
        <div class="order-row">
          <div class="label">Total Amount</div>
          <div class="value">₹${orderDetails.totalAmount}</div>
        </div>
        <div class="order-row">
          <div class="label">Payment Status</div>
          <div class="value">${orderDetails.paymentStatus}</div>
        </div>
        <div class="order-row">
          <div class="label">Delivery Address</div>
          <div class="value">${orderDetails.address}</div>
        </div>
      </div>

      <p style="color:#6B7280; font-size:13px; line-height:1.6;">
        You will receive a tracking confirmation once your order ships. 
        If you have any questions, feel free to contact our support team.
      </p>
    </div>
    <div class="footer">
      <p>Need help? Contact us at <a href="mailto:support@nestro.in" style="color:#8B5E3C;">support@nestro.in</a></p>
      <p>&copy; 2026 Nestro. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

            const emailData = {
                sender: this.defaultSender,
                to: [{ email: toEmail }],
                subject: `Order Confirmation #${orderDetails.orderId} - Nestro`,
                htmlContent: htmlContent,
            };

            const response = await this.makeRequest('/smtp/email', emailData);
            console.log('✅ Brevo order confirmation sent successfully:', response.messageId);
            return true;
        } catch (error) {
            console.error('❌ Brevo order email error:', error.message);
            return false;
        }
    }
}

// Create singleton instance
const brevoMailer = new BrevoMailer();
export default brevoMailer;