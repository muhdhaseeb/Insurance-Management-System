# Insurance Platform - Project Walkthrough

## 🚀 Status: Running
The project is successfully running locally!

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 🎨 Features Implemented

### 1. Modern Dark UI
- **Netflix/Instagram Inspired**: Deep black/gray palette (`#000000`, `#141414`) with **Brand Red** accents (`#E50914`).
- **Glassmorphism**: Transparent, blurred panels for a premium feel.
- **Animations**: Smooth fade-ins and hover effects.
- **Typography**: Uses **Outfit** (headings) and **Inter** (body) from Google Fonts.

### 2. Role-Based Dashboards
- **Admin**: Overview stats, policy management, AI risk analysis table.
- **Agent**: Task lists, recent sales tracking.
- **Customer**: Active policies, claim filing, premium payments, auto-recommendations.
- **Shared Layout**: Consistent sidebar navigation and header across all roles.

### 3. Two-Factor Authentication (2FA)
- **Flow**:
  1. User logs in with email/password.
  2. If valid, backend generates a 6-digit OTP (logged to console for demo).
  3. Frontend switches to OTP input mode.
  4. User enters code -> Server verifies -> Access Token issued.
- **Security**: HttpOnly cookies, 10-minute OTP expiry.

### 4. Stripe Payment Integration
- **Tech**: Stripe Elements + React Stripe.
- **Flow**:
  1. Customer clicks "Pay Premium" on dashboard.
  2. Redirects to `/pay` with policy details.
  3. Uses `PaymentForm` to collect card details safely.
  4. Backend creates `PaymentIntent` and confirms success.
  5. Policy status updates to `PAID`.

### 5. AI Claim Risk Scoring
- **Logic**: Rule-based engine in `claimController`.
  - Claims > $10k → +40 Risk
  - Late Reporting (>30 days) → +30 Risk
- **Display**: Admin dashboard shows color-coded scores (Green/Yellow/Red) and specific risk flags.

### 6. Auto-Recommendations
- **Logic**: Suggests policies based on simple rules (mocked based on profile).
- **Display**: "Recommended for You" section in Customer Dashboard with "AI Powered" badge.

## 🛠️ How to Test
1. **Login**: 
   - Open [http://localhost:5173](http://localhost:5173)
   - Use any registered email (or register a new one).
   - Check the **Backend Terminal** for the OTP code (it will lock you out without it!).
2. **Dashboard**: Navigate through the role-specific portal.
3. **Pay**: Go as a Customer -> Click "Pay Premium" -> Use Stripe Test Card (4242 4242...).
4. **Admin**: Log in as Admin -> Check "Claims Review" (conceptual link) or see the Risk Table on the main dashboard.

## 📁 Key Files
- `frontend/src/index.css`: Global dark theme styles.
- `backend/src/controllers/authController.js`: 2FA logic.
- `backend/src/controllers/paymentController.js`: Stripe logic.
- `frontend/src/pages/CustomerDashboard.jsx`: Recommendations UI.
