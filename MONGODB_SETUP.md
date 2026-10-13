# MongoDB Setup Guide for Nestro Project

## 🎯 Quick Setup Options

### Option 1: MongoDB Atlas (Cloud) ⭐ **RECOMMENDED**

#### Why Atlas?
- ✅ No local installation required
- ✅ Free 500MB storage
- ✅ Automatic backups
- ✅ High availability
- ✅ Works from anywhere

#### Setup Steps:
1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up with email or Google account
   - Complete verification

2. **Create Database**
   - Choose "Build a Database" 
   - Select **M0 Sandbox** (Free tier)
   - Choose **AWS** provider
   - Select closest region (e.g., Mumbai for India users)
   - Cluster name: `Nestro-Cluster`

3. **Configure Access**
   - **Database User**: Create username/password
   - **Network Access**: Add IP `0.0.0.0/0` (allow all) for development
   
4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Format: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/nestro?retryWrites=true&w=majority`

5. **Update .env File**
   ```env
   # Replace local connection with Atlas
   MONGODB_URL=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/nestro?retryWrites=true&w=majority
   ```

---

### Option 2: Local MongoDB Installation

#### For Windows:
1. **Download MongoDB**
   - Visit [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Select: **Version**: 7.0+ | **Platform**: Windows | **Package**: MSI
   - Download the installer

2. **Install MongoDB**
   - Run the `.msi` file as Administrator
   - Choose "Complete" installation
   - ✅ Check "Install MongoDB as a Service"
   - ✅ Check "Install MongoDB Compass" (GUI tool)
   - Complete installation

3. **Verify Installation**
   ```powershell
   # Check if MongoDB service is running
   Get-Service -Name MongoDB
   
   # Test connection
   mongo --version
   ```

4. **Start MongoDB Service** (if not auto-started)
   ```powershell
   # Start service
   net start MongoDB
   
   # Or via Services app
   services.msc → Find "MongoDB" → Start
   ```

#### For macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### For Linux (Ubuntu/Debian):
```bash
# Import GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start service
sudo systemctl start mongod
sudo systemctl enable mongod
```

---

## 🔧 Configuration

### Current .env Configuration:
```env
# Local MongoDB (default)
MONGODB_URL=mongodb://localhost:27017/nestro

# MongoDB Atlas (replace above line when using cloud)
# MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/nestro?retryWrites=true&w=majority
```

### Connection Test:
The application will show:
- ✅ `Database connected` - Success
- ❌ `MongoDB connection error` - Check connection string

---

## 📊 Database Structure

### Collections Created Automatically:
- `users` - User accounts and profiles
- `products` - Furniture products catalog
- `categories` - Product categories
- `colors` - Available color options
- `rooms` - Room types (bedroom, living room, etc.)
- `carts` - User shopping carts
- `orders` - Purchase orders
- `contacts` - Contact form submissions

---

## 🛠️ Troubleshooting

### Common Issues:

#### 1. **Connection Refused (Local)**
```
MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: MongoDB service is not running
- Windows: `net start MongoDB`
- Mac: `brew services start mongodb-community`
- Linux: `sudo systemctl start mongod`

#### 2. **Authentication Failed (Atlas)**
```
MongoServerError: bad auth Authentication failed
```
**Solution**: Check username/password in connection string

#### 3. **Network Error (Atlas)**
```
MongoNetworkTimeoutError: Server selection timed out
```
**Solution**: Check network access settings in Atlas (allow your IP)

#### 4. **Database Name Issues**
**Solution**: Ensure database name is `nestro` in connection string

### Debug Mode:
Set `NODE_ENV=development` to see detailed MongoDB logs.

---

## 🔒 Security Best Practices

### For Production:
1. **Atlas**:
   - Restrict IP access to your server only
   - Use strong passwords
   - Enable database access logs

2. **Local**:
   - Enable authentication
   - Configure firewall rules
   - Regular backups

### Environment Variables:
```env
# Never commit real credentials to git
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/nestro

# Use different databases for different environments
# MONGODB_URL_DEV=mongodb://localhost:27017/nestro_dev
# MONGODB_URL_TEST=mongodb://localhost:27017/nestro_test
# MONGODB_URL_PROD=mongodb+srv://...nestro_prod
```

---

## 📈 Monitoring

### MongoDB Compass (GUI):
- Connect with same connection string
- View collections and documents
- Run queries visually
- Monitor performance

### Atlas Dashboard:
- Real-time metrics
- Performance insights
- Automated alerts
- Backup management

---

## 💡 Tips

1. **Start with Atlas** - Easier setup, no local dependencies
2. **Free Tier Limits** - 500MB storage, good for development
3. **Connection Pooling** - Already configured in the app
4. **Indexes** - Automatically created for optimal performance
5. **Backups** - Atlas does automatic backups, set up manual backups for local installs

---

## 🚀 Quick Start Command
```bash
# If you choose Atlas, just update .env and restart:
npm start

# For local MongoDB, ensure service is running first:
# Windows: net start MongoDB
# Then: npm start
```