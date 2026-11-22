# 🚀 CampusConnect — Production Deployment Guide (with MongoDB Atlas)

This guide walks you through deploying the complete full-stack **CampusConnect** platform with **MongoDB Atlas**.

---

## 📋 Table of Contents
1. [Step 1: MongoDB Atlas Configuration (Crucial)](#step-1-mongodb-atlas-configuration-crucial)
2. [Step 2: Seed Data into MongoDB Atlas](#step-2-seed-data-into-mongodb-atlas)
3. [Step 3: Deploy to Cloud (Render - Recommended 1-Service Deploy)](#step-3-deploy-to-cloud-render---recommended)
4. [Alternative: Split Deployment (Vercel Frontend + Render Backend)](#alternative-split-deployment-vercel--render)
5. [Environment Variables Reference](#environment-variables-reference)

---

## Step 1: MongoDB Atlas Configuration (Crucial)

Before deploying to the cloud, you **must** allow network access from cloud IP addresses in your MongoDB Atlas dashboard:

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. In the left sidebar, under **Security**, click **Network Access**.
3. Click the green **+ Add IP Address** button (top right).
4. Click **Allow Access from Anywhere** (this automatically sets the IP to `0.0.0.0/0`).
5. Click **Confirm**. *(Atlas takes ~1 minute to update the firewall).*

> ⚠️ **Why this is required**: Cloud platforms (Render, Vercel, Railway, AWS) use dynamic IP addresses. If `0.0.0.0/0` is not added, the cloud server will be blocked with:
> `Could not connect to any servers in your MongoDB Atlas cluster: IP not whitelisted`.

### Get your MongoDB Atlas Connection String
1. Under **Deployment**, click **Database**.
2. Click **Connect** on your cluster.
3. Choose **Drivers** (Node.js).
4. Copy the connection string. It will look like:
   ```text
   mongodb+srv://<username>:<password>@campusconnect.goxhko5.mongodb.net/campusconnect?retryWrites=true&w=majority
   ```
   *(Replace `<username>` and `<password>` with your database user credentials. Note the `/campusconnect` database name before the `?` query parameters).*

---

## Step 2: Seed Data into MongoDB Atlas

Once `0.0.0.0/0` is whitelisted in Atlas, you can populate your Atlas database with the initial campus events and registrations from your terminal:

```bash
# In the terminal (run from project root or backend folder):
cd "final-app/backend"

# Run seeder pointing to your Atlas URI:
MONGODB_URI="mongodb+srv://<username>:<password>@campusconnect.goxhko5.mongodb.net/campusconnect?retryWrites=true&w=majority" node seed.js --force
```

You will see:
```text
[MongoDB] Connected successfully to host: campusconnect-shard-...
[Seeder] Seeded 9 initial campus events into MongoDB.
[Seeder] Seeded 4 initial registrations into MongoDB.
[Seeder] Database seeding finished successfully.
```

---

## Step 3: Deploy to Cloud (Render - Recommended)

Render provides free hosting and can run the entire platform (Express API + Vite React Frontend) as a single service.

### 1. Push code to GitHub
Make sure your latest code is committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "feat: complete multi-page RBAC platform ready for deployment"
git push origin main
```

### 2. Create Web Service on Render
1. Log in to [Render.com](https://render.com/).
2. Click **New +** $\rightarrow$ **Web Service**.
3. Connect your GitHub repository.
4. Configure the service settings:

| Setting | Value |
| :--- | :--- |
| **Name** | `campusconnect` (or your choice) |
| **Region** | Choose closest to your users (e.g., Singapore / Oregon / Frankfurt) |
| **Branch** | `main` |
| **Root Directory** | *(leave blank)* |
| **Runtime** | `Node` |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

5. Under **Environment Variables**, add:

| Key | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://<username>:<password>@campusconnect.goxhko5.mongodb.net/campusconnect?retryWrites=true&w=majority` |

6. Click **Deploy Web Service**!

Render will build the React frontend with Vite into `final-app/frontend/dist` and start the Express server, which serves both the `/api/*` endpoints and the frontend on one unified HTTPS domain with zero CORS issues!

---

## Alternative: Split Deployment (Vercel + Render)

If you prefer deploying the frontend and backend to separate hosting platforms:

### 1. Backend on Render
- **Root Directory**: `final-app/backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `PORT`: `5000`
  - `MONGODB_URI`: `<Atlas Connection String>`
  - `CLIENT_ORIGIN`: `https://your-frontend.vercel.app`
- Note your backend URL (e.g. `https://campusconnect-api.onrender.com`).

### 2. Frontend on Vercel
- Import repository into [Vercel](https://vercel.com/).
- **Root Directory**: `final-app/frontend`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://campusconnect-api.onrender.com/api`
- Click **Deploy**.

---

## Environment Variables Reference

| Variable | Description | Example |
| :--- | :--- | :--- |
| `MONGODB_URI` | Full connection URI to your MongoDB Atlas cluster | `mongodb+srv://user:pass@cluster.mongodb.net/campusconnect?retryWrites=true&w=majority` |
| `PORT` | Port for Express server | `5000` |
| `NODE_ENV` | Environment mode | `production` |
| `CLIENT_ORIGIN` | Allowed CORS origin (for split deployments) | `https://your-app.vercel.app` |
| `VITE_API_URL` | Frontend API target (defaults to `/api` for unified) | `https://your-backend.onrender.com/api` |
