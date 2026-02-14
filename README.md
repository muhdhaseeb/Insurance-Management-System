# Insurance Management System

A modern, full-stack insurance platform built with the MERN stack (MongoDB, Express, React, Node.js). This application streamlines insurance administration with role-based dashboards, AI-driven risk assessment, secure payments via Stripe, and a premium dark-themed UI.

## 🚀 Features

-   **Role-Based Access Control (RBAC):** Distinct dashboards for Admins, Agents, and Customers.
-   **Modern UI/UX:** Sleek dark mode design inspired by Netflix/Instagram, featuring glassmorphism and smooth animations.
-   **AI Integration:**
    -   **AI Risk Assessment:** Automated claim risk scoring using Google Gemini AI.
    -   **Smart Recommendations:** Personalized policy suggestions based on user profiles.
-   **Secure Payments:** Integrated Stripe payment gateway for seamless premium transactions.
-   **Security:**
    -   JWT-based authentication (Access & Refresh tokens).
    -   Two-Factor Authentication (2FA) via email OTP.
    -   HttpOnly cookies for enhanced security.
-   **Data Management:** Robust policy and claim management system backed by MongoDB.

## 🛠️ Tech Stack

### Frontend
-   **Framework:** React (Vite)
-   **Styling:** Tailwind CSS (Dark Mode, Responsive)
-   **State Management:** React Hooks
-   **Routing:** React Router DOM
-   **HTTP Client:** Axios
-   **Payment:** Stripe.js / React Stripe

### Backend
-   **Runtime:** Node.js
-   **Framework:** Express.js
-   **Database:** MongoDB (Mongoose ODM)
-   **Authentication:** JSON Web Tokens (JWT), BCrypt
-   **AI Engine:** Google Generative AI (Gemini)
-   **Email:** Nodemailer (for OTPs/Notifications)
-   **Validation:** Express Validator

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/insurance-system.git
    cd insurance-system
    ```

2.  **Install Dependencies:**
    This project includes a helper script to install dependencies for both backend and frontend from the root.
    ```bash
    npm run install-all
    ```
    *Alternatively, you can install them manually:*
    ```bash
    cd backend && npm install
    cd ../frontend && npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the `backend/` directory with the following variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_ACCESS_SECRET=your_secure_access_secret
    JWT_REFRESH_SECRET=your_secure_refresh_secret
    STRIPE_SECRET_KEY=your_stripe_secret_key
    NODE_ENV=development
    # Add Google Gemini API Key if applicable
    GEMINI_API_KEY=your_gemini_api_key 
    # Add Email Service Credentials (if using Nodemailer)
    EMAIL_USER=your_email@example.com
    EMAIL_PASS=your_email_app_password
    ```

## 🚀 Running the Application

To run both the backend and frontend concurrently in development mode:

```bash
npm run dev
```

-   **Frontend:** `http://localhost:5173`
-   **Backend:** `http://localhost:5000`

## 📂 Project Structure

```
insurance-system/
├── backend/            # Express.js API
│   ├── src/
│   │   ├── controllers/ # Request handlers (Auth, Claims, Policies, etc.)
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Auth & error handling
│   │   └── server.js    # Entry point
│   ├── .env             # Environment variables
│   └── package.json
│
├── frontend/           # React + Vite App
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route pages (Dashboards, Login, etc.)
│   │   ├── context/     # Global state (Auth, Theme)
│   │   └── main.jsx     # Entry point
│   └── package.json
│
├── package.json        # Root scripts
└── README.md           # Project documentation
```

## 🧪 Testing

-   **Auth:** Register a new user or login with existing credentials. OTPs are logged to the backend console in development mode.
-   **Payments:** Use Stripe test card numbers (e.g., `4242 4242 4242 4242`) to simulate transactions.
-   **AI Features:** Submit a claim to trigger the risk assessment logic.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## 📄 License

This project is licensed under the MIT License.
