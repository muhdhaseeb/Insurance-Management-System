import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Policies from "./pages/Policies";
import Claims from "./pages/Claims";
import AdminDashboard from "./pages/AdminDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import PaymentPage from "./pages/PaymentPage";
import PolicyPurchase from "./pages/PolicyPurchase";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import PolicyWizard from "./pages/PolicyWizard";
import ChatHistory from "./pages/ChatHistory";
import Profile from "./pages/Profile";
import Chatbot from "./components/Chatbot";
import ResetPassword from "./pages/ResetPassword";
import PolicyDetails from "./pages/PolicyDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agent"
          element={
            <ProtectedRoute role="AGENT">
              <AgentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/policies"
          element={
            <ProtectedRoute>
              <Policies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/claims"
          element={
            <ProtectedRoute>
              <Claims />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wizard"
          element={
            <ProtectedRoute>
              <PolicyWizard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat-history"
          element={
            <ProtectedRoute>
              <ChatHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pay"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchase"
          element={
            <ProtectedRoute>
              <PolicyPurchase />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/policy/:id"
          element={
            <ProtectedRoute>
              <PolicyDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      <Chatbot />
    </BrowserRouter>
  );
}
