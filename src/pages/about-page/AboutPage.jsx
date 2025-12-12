import { useNavigate } from "react-router-dom";
import { Header } from "../../component/Header";
import "./AboutPage.css";

export function AboutPage() {
  const navigate = useNavigate();

  const teamMembers = [
    {
      id: 1,
      name: "Parag Chouhan",
      role: "CEO & Founder",
      bio: "Visionary leader building India's most trusted meal delivery ecosystem with a passion for transparency and quality.",
      emoji: "👔",
      icon: "🚀"
    },
    {
      id: 2,
      name: "Ankit Bowade",
      role: "CTO & Co-Founder",
      bio: "Tech innovator driving scalable solutions and seamless user experience across TiffinXpress platform.",
      emoji: "💻",
      icon: "⚙️"
    },
    {
      id: 3,
      name: "Aditya Sharma",
      role: "Team Member",
      bio: "Operations expert ensuring smooth coordination and quality delivery to every customer every day.",
      emoji: "📦",
      icon: "✨"
    },
    {
      id: 4,
      name: "Ayush Pawar",
      role: "Team Member",
      bio: "Customer success specialist focused on building lasting relationships and ensuring user satisfaction.",
      emoji: "🤝",
      icon: "💡"
    }
  ];

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1 className="hero-title">About TiffinXpress</h1>
          <p className="hero-subtitle">
            Transforming Daily Meals Into An Experience of Trust, Quality & Convenience
          </p>
        </div>
      </section>

      {/* Main About Section */}
      <section className="about-section">
        <div className="about-container">
          {/* Story Section */}
          <div className="story-section">
            <div className="story-text">
              <h2 className="section-title">Our Story</h2>
              <p className="story-paragraph">
                TiffinXpress was born from a simple realization — millions of students, professionals, and families compromise on healthy eating due to location or lifestyle. We decided to change that.
              </p>
              <p className="story-paragraph">
                Founded in 2024, TiffinXpress connects users with trusted, verified tiffin providers who deliver hygienic, home-cooked meals daily. We believe in transparency, quality, and genuine customer relationships.
              </p>
            </div>
            <div className="story-highlight">
              <div className="highlight-box">
                <span className="highlight-icon">🎯</span>
                <h3>Our Promise</h3>
                <p>Fresh. Hygienic. Affordable. Every Single Day.</p>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="mission-vision">
            <div className="mission-card">
              <h3>Our Mission</h3>
              <p>
                To ensure no one compromises on health because of location. Build India's most trusted meal-delivery ecosystem powered by transparency, real reviews, and seamless convenience.
              </p>
            </div>
            <div className="vision-card">
              <h3>Our Vision</h3>
              <p>
                A world where every meal is prepared with love, delivered with care, and enjoyed with confidence — because good food connects us all.
              </p>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="why-choose-section">
            <h2 className="section-title">Why Choose TiffinXpress?</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <span className="benefit-icon">🍲</span>
                <h4>Home-Cooked Meals</h4>
                <p>Pure homemade meals from verified kitchens prepared with fresh ingredients</p>
              </div>
              <div className="benefit-card">
                <span className="benefit-icon">🧼</span>
                <h4>Hygienic & Fresh</h4>
                <p>Strict quality checks and clean, eco-friendly packaging for every delivery</p>
              </div>
              <div className="benefit-card">
                <span className="benefit-icon">💸</span>
                <h4>Affordable Pricing</h4>
                <p>Flexible daily and monthly subscription plans that fit your budget</p>
              </div>
              <div className="benefit-card">
                <span className="benefit-icon">⭐</span>
                <h4>Genuine Reviews</h4>
                <p>Real, verified customer feedback to help you choose the best provider</p>
              </div>
              <div className="benefit-card">
                <span className="benefit-icon">🌱</span>
                <h4>Diverse Options</h4>
                <p>Veg, Jain, High-Protein, Vegan, and more dietary preferences available</p>
              </div>
              <div className="benefit-card">
                <span className="benefit-icon">🚀</span>
                <h4>Tech-Driven</h4>
                <p>Seamless app experience with real-time tracking and instant support</p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="stats-section">
            <h2 className="section-title">Growing Every Day</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-number">500+</span>
                <span className="stat-label">Happy Users</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">40+</span>
                <span className="stat-label">Verified Kitchens</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">10k+</span>
                <span className="stat-label">Meals Delivered</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Customer Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="team-container">
          <h2 className="team-title">Meet Our Team</h2>
          <p className="team-subtitle">
            Passionate individuals building the future of meal delivery
          </p>

          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-card">
                <div className="team-card-inner">
                  {/* Front of card */}
                  <div className="team-card-front">
                    <div className="member-avatar">
                      <span className="avatar-emoji">{member.emoji}</span>
                    </div>
                    <h3 className="member-name">{member.name}</h3>
                    <p className="member-role">{member.role}</p>
                  </div>

                  {/* Back of card */}
                  <div className="team-card-back">
                    <div className="back-content">
                      <span className="icon-large">{member.icon}</span>
                      <p className="member-bio">{member.bio}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="values-container">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">🤝</div>
              <h4>Trust & Transparency</h4>
              <p>Honest communication and verified information at every step</p>
            </div>
            <div className="value-item">
              <div className="value-icon">✨</div>
              <h4>Quality First</h4>
              <p>Unwavering commitment to excellence in every meal</p>
            </div>
            <div className="value-item">
              <div className="value-icon">💪</div>
              <h4>Customer Centric</h4>
              <p>Your satisfaction is our greatest success metric</p>
            </div>
            <div className="value-item">
              <div className="value-icon">🌟</div>
              <h4>Innovation</h4>
              <p>Constantly improving to serve you better</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section">
        <div className="cta-content">
          <h2>Ready to Experience Fresh, Delicious Meals?</h2>
          <p>Join hundreds of satisfied customers enjoying healthy home-cooked meals daily</p>
          <div className="cta-buttons">
            <button
              onClick={() => navigate("/subscription-management")}
              className="cta-btn primary"
            >
              🍱 Subscribe Now
            </button>
            <button
              onClick={() => navigate("/discover-tiffin")}
              className="cta-btn secondary"
            >
              🔍 Explore Tiffins
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
