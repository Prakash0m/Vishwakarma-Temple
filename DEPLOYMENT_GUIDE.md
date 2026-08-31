# 🚀 Vishwakarma Temple & Tole Management System — Vercel Deployment Guide

This project is configured for **1-Click Full-Stack Deployment** on [Vercel](https://vercel.com).
The React (Vite) frontend and Node.js Express serverless backend (`/api/*`) are deployed together in a single repository with zero CORS configuration needed.

---

## 📋 Prerequisites
1. **GitHub Account** (https://github.com)
2. **Vercel Account** (https://vercel.com)
3. **Free MongoDB Atlas Database URI** (https://cloud.mongodb.com)

---

## 🛠️ Step-by-Step Deployment Instructions

### Step 1: Create a Free MongoDB Database (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com) and create a free account.
2. Create a **Shared (Free M0)** Cluster.
3. Under **Database Access**, create a user with username and password (e.g. `temple_admin`).
4. Under **Network Access**, add IP Address `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** → **Drivers** → Copy your connection string:
   ```
   mongodb+srv://temple_admin:<password>@cluster0.xxxxx.mongodb.net/vishwakarma_temple?retryWrites=true&w=majority
   ```

---

### Step 2: Push Project to GitHub
In your terminal, run:
```bash
cd /Users/omprakeshsharma/Desktop/temple

# Initialize Git repository
git init

# Add all files
git add .

# Commit
git commit -m "feat: complete Vishwakarma Temple and Tole Management System"

# Link to your GitHub Repository and Push
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git push -u origin main
```

---

### Step 3: Deploy on Vercel
1. Log in to [Vercel Dashboard](https://vercel.com).
2. Click **"Add New..."** → **"Project"**.
3. Select your GitHub repository and click **"Import"**.
4. Configure Project Settings:
   - **Framework Preset**: `Vite` (or `Other`)
   - **Root Directory**: `./` (Leave default)
   - **Build Command**: `cd frontend && npm install && npm run build` (Automatically detected from `vercel.json`)
   - **Output Directory**: `frontend/dist` (Automatically detected from `vercel.json`)
5. Under **Environment Variables**, add the following:

| Name | Value |
| :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://temple_admin:<password>@cluster0.xxxxx.mongodb.net/vishwakarma_temple?retryWrites=true&w=majority` |
| `JWT_SECRET` | `super_secret_jwt_token_key_vishwakarma_temple_2026` |
| `NODE_ENV` | `production` |

6. Click **"Deploy"**!

---

### Step 4: Access Your Live Website
Once Vercel finishes the build (typically ~1 minute):
- **Public Website**: `https://your-project-name.vercel.app`
- **Admin Portal**: `https://your-project-name.vercel.app/admin`
- **Default Admin Credentials**:
  - **Email**: `admin@vishwakarmatemple.org`
  - **Password**: `TempleAdmin@2026`

---

## ⚡ Method 2: Deploy via Vercel CLI (Optional)
If you have Vercel CLI installed:
```bash
npm install -g vercel
cd /Users/omprakeshsharma/Desktop/temple
vercel
```
Follow the interactive prompts and add your environment variables when asked.
