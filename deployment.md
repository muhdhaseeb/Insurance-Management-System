# Deployment Guide - Insurance Management System

Follow these steps to deploy the Insurance Management System to a production environment.

## Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB instance)
- Stripe Account (for API keys)
- SMTP service (Gmail, SendGrid, etc.)

## Backend Setup

1. **Environment Variables**: Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_ACCESS_SECRET=your_secure_access_secret
   JWT_REFRESH_SECRET=your_secure_refresh_secret
   STRIPE_SECRET_KEY=your_stripe_sk_test_...
   NODE_ENV=production
   ```

2. **Build & Start**:
   ```bash
   cd backend
   npm install
   npm start
   ```

## Frontend Setup

1. **API Configuration**: Ensure `frontend/src/api.js` points to your production backend URL.
   ```javascript
   const api = axios.create({
     baseURL: "https://your-api-domain.com",
     withCredentials: true,
   });
   ```

2. **Build**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
   This will generate a `dist/` folder which can be hosted on Vercel, Netlify, or AWS S3.

## One-Command Deployment (Using Root Package)

If you are using a VPS (Ubuntu/Nginx):
1. Clone the repo.
2. Run `npm run install-all`.
3. Use `pm2` to manage the backend process.
4. Point Nginx to the `frontend/dist` folder for the frontend and proxy `/api/*` to the backend.

## Post-Deployment Checklist
- [ ] Verify SSL certificates (HTTPS).
- [ ] Test the AI Policy Wizard flow.
- [ ] Confirm Stripe Webhooks are configured.
- [ ] Test the AI Chatbot responsiveness.
