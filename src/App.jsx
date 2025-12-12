import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";
import { DiscoverTiffin } from "./pages/discover-tiffins/DiscoverTiffin.jsx";
import { HomePage } from "./pages/home-page/HomePage.jsx";
import { SubscriptionsPage } from "./pages/subscriptions-page/SubscriptionsPage.jsx";
import { SubscriptionManagement } from "./pages/subscriptions-page/SubscriptionManagement.jsx";
import { MySubscriptions } from "./pages/subscriptions-page/MySubscriptions.jsx";
import { AboutPage } from "./pages/about-page/AboutPage.jsx";
import { Login } from "./pages/auth/Login.jsx";
import { Signup } from "./pages/auth/Signup.jsx";
import { ProtectedRoute } from "./component/ProtectedRoute.jsx";
import { Footer } from "./component/Footer.jsx";
import { initScrollToTop } from "./utils/scrollUtils.js";
import { useAuth } from "./context/AuthContext.jsx";

export function App() {
   const { pathname } = useLocation();
   const { loading } = useAuth();

  // Disable browser scroll memory
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Scroll to top on reload
  useEffect(() => {
    initScrollToTop();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f0eb'
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#ff7a00'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route
          path="subscription-management"
          element={
            <ProtectedRoute>
              <SubscriptionManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-subscriptions"
          element={
            <ProtectedRoute>
              <MySubscriptions />
            </ProtectedRoute>
          }
        />
        <Route path="discover-tiffin" element={<DiscoverTiffin />} />
        <Route path="subscriptions-page" element={<SubscriptionsPage />} />
        <Route path="about-page" element={<AboutPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
