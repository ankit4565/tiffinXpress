import React from 'react';
import './Footer.css';

export function Footer() {
  return (
    <footer className="sticky-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Company</h4>
          <a href="#about">About Us</a>
          <a href="#careers">Careers</a>
          <a href="#blog">Blog</a>
        </div>
        
        <div className="footer-section">
          <h4>For Customers</h4>
          <a href="#faq">FAQ</a>
          <a href="#help">Help & Support</a>
          <a href="#contact">Contact Us</a>
        </div>
        
        <div className="footer-section">
          <h4>For Vendors</h4>
          <a href="#vendor">Become a Vendor</a>
          <a href="#partner">Partner with Us</a>
        </div>
        
        <div className="footer-section">
          <h4>Legal</h4>
          <a href="#terms">Terms & Conditions</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#refund">Refund Policy</a>
        </div>

        <div className="footer-section social">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#facebook" className="social-icon">f</a>
            <a href="#twitter" className="social-icon">𝕏</a>
            <a href="#instagram" className="social-icon">📷</a>
            <a href="#linkedin" className="social-icon">in</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 TiffinXpress. All rights reserved.</p>
        <div className="footer-badges">
          <span className="badge">Secure Payment</span>
          <span className="badge">24/7 Support</span>
          <span className="badge">Verified Vendors</span>
        </div>
      </div>
    </footer>
  );
}
