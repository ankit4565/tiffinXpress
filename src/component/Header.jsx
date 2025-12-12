import React, { useState } from 'react';
import "./Header.css";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { scrollToTopOnReload } from '../utils/scrollUtils.js';

export function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogoClick = () => {
    scrollToTopOnReload();
    window.location.reload();
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <header className="header-container">
      <div className="header-left">
        <img src="/images/logo1.jpeg" alt="App Logo" onClick={handleLogoClick} className="app-logo" />
      </div>

      <nav className="header-centre">
        <ul className="nav-list">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/discover-tiffin">Discover Tiffins</a>
          </li>
          <li>
            <a href="/subscription-management">Subscription</a>
          </li>
          <li>
            <a href="/about-page">About Us</a>
          </li>
        </ul>
      </nav>

      <div className="header-right">
        {isAuthenticated ? (
          <div className="user-menu-wrapper">
            <button
              className="user-profile-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <span className="user-avatar">{user?.email?.[0].toUpperCase()}</span>
              <span className="user-email">{user?.email}</span>
              <span className="menu-arrow">▼</span>
            </button>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-info">
                  <p className="user-name">{user?.user_metadata?.full_name || 'User'}</p>
                  <p className="user-email-small">{user?.email}</p>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={() => { navigate('/my-subscriptions'); setShowUserMenu(false); }}>
                  📋 My Subscriptions
                </button>
                <button className="dropdown-item" onClick={() => navigate('/profile')}>
                  👤 My Profile
                </button>
                <button className="dropdown-item" onClick={() => navigate('/orders')}>
                  📦 My Orders
                </button>
                <button className="dropdown-item" onClick={() => navigate('/settings')}>
                  ⚙️ Settings
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="sign-in-btn" onClick={() => navigate('/login')}>
              Sign In
            </button>
            <button className="get-started-btn" onClick={() => navigate('/signup')}>
              Get Started
            </button>
          </>
        )}
      </div>
    </header>
  );
}
