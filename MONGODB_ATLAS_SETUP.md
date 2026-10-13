# MongoDB Atlas Setup for Nestro Backend

## Step 1: Create MongoDB Atlas Account & Cluster

1. **Sign up** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create a new project** (or use existing one)
3. **Create a cluster**:
   - Choose **M0 Sandbox** (Free tier)
   - Select your preferred cloud provider and region
   - Name your cluster (e.g., "nestro-cluster")

## Step 2: Create Database User

1. In Atlas dashboard, go to **Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication method
4. **Username**: Create a username (e.g., `nestro-admin`)
5. **Password**: Generate a strong password ⚠️ **Save this password securely!**
6. **Database User Privileges**: Select **Read and write to any database**
7. Click **Add User**

## Step 3: Configure Network Access

1. Go to **Network Access** in Atlas dashboard
2. Click **Add IP Address**
3. For **Render deployment**, add: `0.0.0.0/0` (allows access from anywhere)
   
   ⚠️ **Security Note**: This allows access from any IP address. For better security in production, you can:
   - Use Render's specific IP ranges if available
   - Implement additional authentication layers
   - Monitor access logs regularly

4. Add a description: "Render deployment access"
5. Click **Confirm**

## Step 4: Get Connection String

1. In Atlas dashboard, click **Connect** on your cluster
2. Choose **Connect your application**
3. **Driver**: Node.js
4. **Version**: 4.1 or later
5. **Copy** the connection string - it will look like:
   ```
   mongodb+srv://<username>:<password>@clustername.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 5: Prepare Connection String

1. **Replace `<username>`** with your database username (e.g., `nestro-admin`)
2. **Replace `<password>`** with your database password
3. **Add database name**: Add `/nestro` after `.net` and before the `?`:
   ```
   mongodb+srv://nestro-admin:your-password@clustername.xxxxx.mongodb.net/nestro?retryWrites=true&w=majority
   ```

### Important: URL Encoding Special Characters

If your password contains special characters, you must URL-encode them:

- `@` becomes `%40`
- `#` becomes `%23`  
- `%` becomes `%25`
- `+` becomes `%2B`
- `/` becomes `%2F`
- `:` becomes `%3A`
- `?` becomes `%3F`
- `=` becomes `%3D`
- `&` becomes `%26`

**Example**: If password is `myPass@123#`, encode it as `myPass%40123%23`

## Step 6: Configure Render Environment

1. Go to your **Render Dashboard**
2. Select your **Nestro-backend** service
3. Go to **Environment** tab
4. Click **Add Environment Variable**
5. **Key**: `MONGODB_URI`
6. **Value**: Your complete connection string (from Step 5)
7. Click **Save Changes**

## Step 7: Deploy & Test

1. Render will **automatically redeploy** after saving environment variables
2. Check the **Logs** tab to verify successful connection:
   ```
   ✅ Database connected successfully
   🔗 Connected to: mongodb+srv://<credentials>@clustername.xxxxx.mongodb.net/nestro
   ```
3. Test the health endpoint: `https://your-app.onrender.com/health`

## Troubleshooting

### Connection Issues
- **Authentication failed**: Double-check username/password and URL encoding
- **Network error**: Verify Network Access whitelist includes `0.0.0.0/0`
- **Connection timeout**: Check if cluster is in the same region as Render

### Security Best Practices
- Use strong, unique passwords
- Regularly rotate database credentials
- Monitor database access logs
- Consider using MongoDB Atlas's built-in security features
- Set up database-level access controls

### Additional Environment Variables for Full Functionality

For complete Nestro backend functionality, also configure:
- `BREVO_API_KEY` - For email services
- `CLOUD_NAME`, `API_KEY`, `API_SECRET` - For Cloudinary image uploads
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` - For payment processing