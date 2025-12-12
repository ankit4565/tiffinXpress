import { Header } from "../../component/Header";
import "./Homepage.css";
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <main className="tc-hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />

        <div className="hero-inner">
          <div className="hero-text">
            <h1>
              Get <span className="accent">Homely Meals</span> at
              <br />
              Your Doorstep
            </h1>
            <p className="lead">
              Connect with local tiffin services for fresh, home-style meals
              delivered daily to students, professionals, and families.
            </p>

            <div className="hero-actions">
              <button className="btn primary" onClick={() => navigate('/discover-tiffin')}>
                Explore Tiffins <span className="arrow">→</span>
              </button>
              <button className="btn outline">Become a Vendor</button>
            </div>

            <div className="search-wrap">
              <div className="search-box">
                <span className="loc-icon">📍</span>
                <input type="text" placeholder="Enter your location" />
                <button className="search-btn">Search</button>
              </div>
            </div>
          </div>
        </div>
        {/* Features / Why Choose Our Network section */}
        <section className="tc-features">
          <div className="features-inner">
            <h2 className="features-title">
              Why Choose <span>Our Network</span>?
            </h2>
            <p className="features-sub">
              We bridge the gap between food lovers and talented home chefs
            </p>

            <div className="features-grid">
              <article className="feature-card">
                <div className="feature-icon">🍽️</div>
                <h3>Homemade Quality</h3>
                <p>
                  Enjoy freshly prepared, home-cooked meals made with love and
                  traditional recipes
                </p>
              </article>

              <article className="feature-card">
                <div className="feature-icon">⏰</div>
                <h3>Daily Delivery</h3>
                <p>
                  Reliable daily tiffin service delivered hot and fresh to your
                  doorstep on time
                </p>
              </article>

              <article className="feature-card">
                <div className="feature-icon">🛡️</div>
                <h3>Verified Providers</h3>
                <p>
                  All tiffin centers are verified with quality checks and
                  customer reviews
                </p>
              </article>

              <article className="feature-card">
                <div className="feature-icon">📈</div>
                <h3>Grow Your Business</h3>
                <p>
                  Tiffin providers can reach more customers and grow their
                  business effortlessly
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works">
          <div className="how-inner">
            <h2 className="section-title">How <span>TiffinXpress</span> Works</h2>
            <p className="section-subtitle">Simple steps to get delicious home-cooked meals</p>
            
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-icon">🔍</div>
                <h3>Find</h3>
                <p>Search for tiffin providers near you with best ratings and reviews</p>
              </div>
              
              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-icon">📋</div>
                <h3>Choose Plan</h3>
                <p>Select from flexible subscription plans - Basic, Premium, or Deluxe</p>
              </div>
              
              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-icon">✅</div>
                <h3>Subscribe</h3>
                <p>Easy subscription process with secure payment methods</p>
              </div>
              
              <div className="step-card">
                <div className="step-number">4</div>
                <div className="step-icon">🚚</div>
                <h3>Enjoy</h3>
                <p>Receive fresh, hot meals delivered to your doorstep daily</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="pricing-preview">
          <div className="pricing-inner">
            <h2 className="section-title">Our <span>Subscription Plans</span></h2>
            <p className="section-subtitle">Choose the perfect plan for your needs</p>
            
            <div className="pricing-cards">
              <div className="price-card basic">
                <div className="plan-tag">Basic</div>
                <div className="plan-emoji">🍜</div>
                <h3>Starter Plan</h3>
                <p className="plan-price">₹<span>2500</span>/month</p>
                <ul className="plan-features">
                  <li>✓ 7 meals per week</li>
                  <li>✓ Daily delivery</li>
                  <li>✓ Lunch & Dinner</li>
                  <li>✓ Basic meal options</li>
                </ul>
                <button className="plan-btn" onClick={() => navigate('/subscription-management')}>Get Started</button>
              </div>
              
              <div className="price-card premium popular">
                <div className="plan-tag">Popular</div>
                <div className="plan-emoji">🍱</div>
                <h3>Premium Plan</h3>
                <p className="plan-price">₹<span>4500</span>/month</p>
                <ul className="plan-features">
                  <li>✓ 7 meals per week</li>
                  <li>✓ Daily delivery</li>
                  <li>✓ Lunch & Dinner</li>
                  <li>✓ Premium meal options</li>
                  <li>✓ Choose your meals</li>
                </ul>
                <button className="plan-btn" onClick={() => navigate('/subscription-management')}>Get Started</button>
              </div>
              
              <div className="price-card deluxe">
                <div className="plan-tag">Best Value</div>
                <div className="plan-emoji">👑</div>
                <h3>Deluxe Plan</h3>
                <p className="plan-price">₹<span>6500</span>/month</p>
                <ul className="plan-features">
                  <li>✓ 7 meals per week</li>
                  <li>✓ Daily delivery</li>
                  <li>✓ Breakfast, Lunch & Dinner</li>
                  <li>✓ Premium meal options</li>
                  <li>✓ Priority delivery</li>
                </ul>
                <button className="plan-btn" onClick={() => navigate('/subscription-management')}>Get Started</button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials">
          <div className="testimonials-inner">
            <h2 className="section-title">What Our <span>Users Say</span></h2>
            <p className="section-subtitle">Join thousands of happy customers</p>
            
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p className="testimonial-text">"Best tiffin service I've used! Fresh, hot meals delivered on time every day. Highly recommended!"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">👨</div>
                  <div>
                    <p className="author-name">Rahul Sharma</p>
                    <p className="author-role">Student, Mumbai</p>
                  </div>
                </div>
              </div>
              
              <div className="testimonial-card">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p className="testimonial-text">"Convenient subscription management, affordable prices, and delicious homemade meals. Worth every penny!"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">👩</div>
                  <div>
                    <p className="author-name">Priya Patel</p>
                    <p className="author-role">Professional, Bangalore</p>
                  </div>
                </div>
              </div>
              
              <div className="testimonial-card">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p className="testimonial-text">"The ability to skip specific meals and days is amazing. Exactly what I needed for my busy lifestyle!"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">👨</div>
                  <div>
                    <p className="author-name">Arjun Kumar</p>
                    <p className="author-role">Entrepreneur, Delhi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Experience Fresh Homemade Meals?</h2>
            <p>Start your subscription today and get delicious, affordable meals delivered to your doorstep</p>
            <button className="cta-btn" onClick={() => navigate('/signup')}>Get Started Now</button>
          </div>
        </section>
      </main>
    </>
  );
}
