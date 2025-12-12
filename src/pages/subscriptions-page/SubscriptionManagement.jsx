import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../component/Header";
import { useSubscription } from "../../context/SubscriptionContext";
import "./SubscriptionManagement.css";

export function SubscriptionManagement() {
  const navigate = useNavigate();
  const { plans, currentSubscription, subscribeToPlan, loading, updateSubscription } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowForm(true);
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsProcessing(true);

    // Validate form
    if (!formData.full_name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError("Please fill in all required fields");
      setIsProcessing(false);
      return;
    }

    try {
      let result;

      if (currentSubscription) {
        // Update existing subscription
        result = await updateSubscription(selectedPlan.id);
      } else {
        // Create new subscription
        result = await subscribeToPlan(selectedPlan.id, formData);
      }

      if (result.error) {
        setError(result.error.message || "Failed to process subscription");
      } else {
        setSuccess(true);
        setFormData({
          full_name: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          postal_code: "",
        });
        setShowForm(false);
        setSelectedPlan(null);

        // Redirect to home after 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="sub-loading">
          <div className="loading-spinner"></div>
          <p>Loading subscription plans...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="subscription-container">
        <div className="subscription-header">
          <h1>Choose Your Perfect Plan</h1>
          <p>Get fresh, home-cooked meals delivered to your doorstep</p>
        </div>

        {currentSubscription && (
          <div className="current-subscription-banner">
            <div className="banner-content">
              <span className="banner-icon">✅</span>
              <div className="banner-text">
                <h3>Current Plan: {currentSubscription.subscription_plans.name}</h3>
                <p>Renews on {new Date(currentSubscription.next_billing_date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        <div className="plans-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${plan.popular ? "popular" : ""} ${
                currentSubscription?.plan_id === plan.id ? "active" : ""
              }`}
            >
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              {currentSubscription?.plan_id === plan.id && (
                <div className="current-badge">Current Plan</div>
              )}

              <div className="plan-icon">{plan.icon}</div>
              <h2 className="plan-name">{plan.name}</h2>
              <p className="plan-description">{plan.description}</p>

              <div className="plan-price">
                <span className="currency">₹</span>
                <span className="amount">{plan.price}</span>
                <span className="period">/month</span>
              </div>

              <div className="plan-features">
                <h4>What's Included:</h4>
                <ul>
                  {plan.features &&
                    plan.features.map((feature, idx) => (
                      <li key={idx}>
                        <span className="check-icon">✓</span>
                        {feature}
                      </li>
                    ))}
                </ul>
              </div>

              <div className="plan-meals">
                <p>
                  <strong>{plan.meals_per_week} meals/week</strong> • Days:{" "}
                  {plan.delivery_days.join(", ")}
                </p>
              </div>

              <button
                className={`plan-button ${
                  currentSubscription?.plan_id === plan.id ? "current" : ""
                }`}
                onClick={() => handlePlanSelect(plan)}
                disabled={currentSubscription?.plan_id === plan.id}
              >
                {currentSubscription?.plan_id === plan.id
                  ? "Current Plan"
                  : currentSubscription
                  ? "Switch Plan"
                  : "Get Started"}
              </button>
            </div>
          ))}
        </div>

        {/* Subscription Form Modal */}
        {showForm && (
          <div className="form-overlay">
            <div className="form-modal">
              <button
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>

              <h2 className="form-title">
                Complete Your {selectedPlan.name} Subscription
              </h2>

              {error && <div className="form-error">{error}</div>}
              {success && (
                <div className="form-success">
                  ✓ Subscription activated! Redirecting to home...
                </div>
              )}

              {!success && (
                <form onSubmit={handleSubmit} className="subscription-form">
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="full_name"
                        placeholder="John Doe"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Mumbai"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Address *</label>
                      <input
                        type="text"
                        name="address"
                        placeholder="123 Main Street, Apt 4B"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        name="state"
                        placeholder="Maharashtra"
                        value={formData.state}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Postal Code</label>
                      <input
                        type="text"
                        name="postal_code"
                        placeholder="400001"
                        value={formData.postal_code}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                      <span>{selectedPlan.name} Plan</span>
                      <span>₹{selectedPlan.price}</span>
                    </div>
                    <div className="summary-row">
                      <span>{selectedPlan.meals_per_week} meals per week</span>
                      <span className="text-muted">Included</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                      <span>Total per Month</span>
                      <span>₹{selectedPlan.price}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Confirm & Subscribe"}
                  </button>

                  <p className="form-disclaimer">
                    By subscribing, you agree to our Terms of Service and auto-renewal policy.
                    You can cancel anytime.
                  </p>
                </form>
              )}
            </div>
          </div>
        )}

        <div className="subscription-footer">
          <h3>Why Choose Us?</h3>
          <div className="benefits-grid">
            <div className="benefit">
              <span className="benefit-icon">🍛</span>
              <h4>Fresh Daily</h4>
              <p>Prepared fresh every morning</p>
            </div>
            <div className="benefit">
              <span className="benefit-icon">🚚</span>
              <h4>Free Delivery</h4>
              <p>Fast and reliable delivery</p>
            </div>
            <div className="benefit">
              <span className="benefit-icon">🎨</span>
              <h4>Customizable</h4>
              <p>Choose your meals daily</p>
            </div>
            <div className="benefit">
              <span className="benefit-icon">💯</span>
              <h4>Quality</h4>
              <p>Home-cooked goodness</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
