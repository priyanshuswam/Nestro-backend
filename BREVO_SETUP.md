# Brevo Email Service Setup Guide

## Overview
This project uses Brevo (formerly Sendinblue) for email services including OTP verification, contact forms, and order confirmations.

## 🚀 Quick Setup

### 1. Create Brevo Account
1. Go to [Brevo.com](https://www.brevo.com/) and create a free account
2. Verify your email address
3. Complete the account setup process

### 2. Get API Key
1. Log in to your Brevo dashboard
2. Go to **Account Settings** → **API Keys** 
3. Click **Generate a new API key**
4. Choose **v3** version
5. Give it a name like "Nestro Backend"
6. Copy the generated API key

### 3. Configure Environment Variables
Add these to your `backend/.env` file:

```env
# Brevo Email Service Configuration
BREVO_API_KEY=your_actual_api_key_here
BREVO_SENDER_EMAIL=noreply@yourdomain.com
BREVO_SENDER_NAME=Nestro Furniture
```

### 4. Sender Email Domain Verification (Important!)
1. In Brevo dashboard, go to **Senders & IP** → **Domains**
2. Add your domain (e.g., `yourdomain.com`)
3. Follow DNS verification steps
4. Or use Brevo's default sending domain for testing

## 📧 Email Features

### Available Email Types
1. **OTP Verification** - User account verification
2. **Contact Form** - Customer inquiries 
3. **Order Confirmation** - Purchase confirmations

### Testing Emails
- Use your own email for testing
- Check spam folder if emails don't arrive
- Brevo free plan: 300 emails/day limit

## 🔧 Configuration Options

### Sender Settings
```javascript
// Default sender configuration
{
    name: "Nestro Furniture",
    email: "noreply@nestro.com"
}
```

### Error Handling
- Invalid API key → Console warning
- Network issues → Automatic retry
- Template errors → Detailed logging

## 🆓 Free Plan Limits
- **300 emails/day**
- **Unlimited contacts**
- **Email templates**
- **Basic reporting**

## 🔄 Migration from Nodemailer
The project has been updated to use Brevo instead of Gmail/Nodemailer:

- ✅ Better deliverability
- ✅ Professional email templates  
- ✅ No Gmail app password needed
- ✅ Built-in analytics
- ✅ Higher sending limits

## 🛠️ Troubleshooting

### Common Issues
1. **API Key Invalid**: Double-check the key in Brevo dashboard
2. **Domain Not Verified**: Verify sender domain or use Brevo's default
3. **Rate Limits**: Free plan has daily limits
4. **Spam Issues**: Ensure proper SPF/DKIM setup

### Debug Mode
Set `NODE_ENV=development` to see detailed email logs.

## 📚 Documentation
- [Brevo API Docs](https://developers.brevo.com/)
- [Node.js SDK](https://github.com/getbrevo/brevo-node/)