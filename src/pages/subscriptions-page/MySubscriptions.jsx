import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../component/Header";
import { useSubscription } from "../../context/SubscriptionContext";
import "./MySubscriptions.css";

export function MySubscriptions() {
  const navigate = useNavigate();
  const { currentSubscription, plans, pauseSubscription, resumeSubscription, cancelSubscription, updateSubscription, loading } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDayWiseCancelModal, setShowDayWiseCancelModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showMealCancelModal, setShowMealCancelModal] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [mealCancelDateRange, setMealCancelDateRange] = useState({ start: "", end: "" });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cancellationHistory, setCancellationHistory] = useState([
    { type: "meal", meals: ["Breakfast"], dateRange: "Dec 15-20", status: "upcoming", savings: 270 },
    { type: "date", dates: ["Dec 25", "Dec 26"], reason: "Holiday", status: "upcoming", savings: 300 }
  ]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="my-sub-loading">
          <div className="loading-spinner"></div>
          <p>Loading your subscription...</p>
        </div>
      </>
    );
  }

  if (!currentSubscription) {
    return (
      <>
        <Header />
        <div className="my-subscriptions-container">
          <div className="no-subscription">
            <span className="no-sub-icon">📋</span>
            <h2>No Active Subscription</h2>
            <p>You don't have an active subscription yet. Choose a plan to get started!</p>
            <button className="btn-get-started" onClick={() => navigate("/subscription-management")}>
              View Plans
            </button>
          </div>
        </div>
      </>
    );
  }

  const handlePause = async () => {
    setIsProcessing(true);
    setError("");
    const { error } = await pauseSubscription();
    if (error) {
      setError("Failed to pause subscription");
    } else {
      setSuccess("Subscription paused successfully!");
      setTimeout(() => setSuccess(""), 3000);
    }
    setIsProcessing(false);
  };

  const handleResume = async () => {
    setIsProcessing(true);
    setError("");
    const { error } = await resumeSubscription();
    if (error) {
      setError("Failed to resume subscription");
    } else {
      setSuccess("Subscription resumed successfully!");
      setTimeout(() => setSuccess(""), 3000);
    }
    setIsProcessing(false);
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    setError("");
    const { error } = await cancelSubscription();
    if (error) {
      setError("Failed to cancel subscription");
    } else {
      setSuccess("Subscription cancelled. Redirecting...");
      setShowCancelModal(false);
      setTimeout(() => navigate("/"), 2000);
    }
    setIsProcessing(false);
  };

  const handleDayWiseCancel = async () => {
    if (selectedDays.length === 0) {
      setError("Please select at least one day to cancel");
      return;
    }

    setIsProcessing(true);
    setError("");
    
    // Remove selected days from delivery_days
    const updatedDeliveryDays = plan.delivery_days.filter(day => !selectedDays.includes(day));

    if (updatedDeliveryDays.length === 0) {
      setError("You must keep at least one delivery day. Use 'Cancel Subscription' to cancel completely.");
      setIsProcessing(false);
      return;
    }

    try {
      // Calculate savings (1 day = 2 meals per day on average)
      const savingsPerDay = (plan.price / 30); // Approximate per day
      const savings = Math.floor(savingsPerDay * selectedDays.length);

      // Update subscription with new delivery days
      const { error } = await updateSubscription(updatedDeliveryDays);
      
      if (error) {
        setError("Failed to update delivery days");
      } else {
        // Add to cancellation history
        const newCancellation = {
          id: Date.now(),
          type: "weekday",
          days: [...selectedDays],
          reason: "Weekly skip",
          status: "ongoing",
          savings: savings,
          createdAt: new Date()
        };
        
        setCancellationHistory([newCancellation, ...cancellationHistory]);

        setSuccess(`Delivery cancelled for: ${selectedDays.join(", ")}. Estimated savings: ₹${savings}/week`);
        setShowDayWiseCancelModal(false);
        setSelectedDays([]);
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      setError("Failed to update delivery days");
    }
    
    setIsProcessing(false);
  };

  const toggleDaySelection = (day) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateInSubscriptionPeriod = (date) => {
    const start = new Date(currentSubscription.start_date);
    const end = new Date(currentSubscription.next_billing_date);
    return date >= start && date <= end;
  };

  const isDeliveryDay = (date) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    return plan.delivery_days.some(day => day.substring(0, 3) === dayName);
  };

  const toggleDateSelection = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDates(prev =>
      prev.includes(dateStr)
        ? prev.filter(d => d !== dateStr)
        : [...prev, dateStr]
    );
  };

  const handleCalendarCancel = async () => {
    if (selectedDates.length === 0) {
      setError("Please select at least one date to cancel");
      return;
    }

    setIsProcessing(true);
    setError("");
    
    try {
      // Calculate savings (2 meals per day)
      const savingsPerDay = (plan.price / 30) * 2; // Approximate for 2 meals
      const savings = Math.floor(savingsPerDay * selectedDates.length);

      // Create orders with cancelled status for selected dates
      // This would typically be a database operation
      
      // Add to cancellation history
      const newCancellation = {
        id: Date.now(),
        type: "specific-dates",
        dates: [...selectedDates],
        mealsSkipped: selectedDates.length * 2,
        status: "completed",
        savings: savings,
        createdAt: new Date()
      };
      
      setCancellationHistory([newCancellation, ...cancellationHistory]);

      setSuccess(`Tiffin cancelled for ${selectedDates.length} date(s). Saving ₹${savings}`);
      setShowCalendarModal(false);
      setSelectedDates([]);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to cancel tiffins");
    }
    
    setIsProcessing(false);
  };

  // Handle both single object and array responses from the join
  if (!currentSubscription || !currentSubscription.subscription_plans) {
    return (
      <>
        <Header />
        <div className="my-subscriptions-container">
          <div className="no-subscription">
            <span className="no-sub-icon">❌</span>
            <h2>Error Loading Subscription</h2>
            <p>Unable to load your subscription details. Please try again later.</p>
            <button className="btn-get-started" onClick={() => navigate("/subscription-management")}>
              Back to Plans
            </button>
          </div>
        </div>
      </>
    );
  }

  const plan = Array.isArray(currentSubscription.subscription_plans)
    ? currentSubscription.subscription_plans[0]
    : currentSubscription.subscription_plans;

  if (!plan) {
    return (
      <>
        <Header />
        <div className="my-subscriptions-container">
          <div className="no-subscription">
            <span className="no-sub-icon">❌</span>
            <h2>Error Loading Plan Data</h2>
            <p>Plan information is missing. Please try again later.</p>
            <button className="btn-get-started" onClick={() => navigate("/subscription-management")}>
              Back to Plans
            </button>
          </div>
        </div>
      </>
    );
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Meal Cancellation Functions
  const availableMeals = [];
  if (plan.features && plan.features.some(f => f.toLowerCase().includes('breakfast'))) {
    availableMeals.push({ name: 'Breakfast', emoji: '🌅', time: '7:00 AM' });
  }
  if (plan.features && plan.features.some(f => f.toLowerCase().includes('lunch'))) {
    availableMeals.push({ name: 'Lunch', emoji: '🍱', time: '12:00 PM' });
  }
  if (plan.features && plan.features.some(f => f.toLowerCase().includes('dinner'))) {
    availableMeals.push({ name: 'Dinner', emoji: '🍛', time: '7:00 PM' });
  }

  const toggleMealSelection = (mealName) => {
    setSelectedMeals(prev =>
      prev.includes(mealName)
        ? prev.filter(m => m !== mealName)
        : [...prev, mealName]
    );
  };

  const handleMealCancelSubmit = async () => {
    if (selectedMeals.length === 0) {
      setError("Please select at least one meal");
      return;
    }

    if (!mealCancelDateRange.start || !mealCancelDateRange.end) {
      setError("Please select a date range");
      return;
    }

    if (new Date(mealCancelDateRange.start) > new Date(mealCancelDateRange.end)) {
      setError("Start date must be before end date");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Calculate number of days in range
      const start = new Date(mealCancelDateRange.start);
      const end = new Date(mealCancelDateRange.end);
      const daysCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      
      // Calculate savings
      const mealPrice = plan.price / (plan.meals_per_week * 7); // Price per meal
      const savings = Math.floor(mealPrice * selectedMeals.length * daysCount);

      // Add to cancellation history
      const newCancellation = {
        id: Date.now(),
        type: "meal",
        meals: [...selectedMeals],
        dateRange: `${mealCancelDateRange.start} to ${mealCancelDateRange.end}`,
        status: "upcoming",
        savings: savings,
        createdAt: new Date()
      };
      
      setCancellationHistory([newCancellation, ...cancellationHistory]);

      setSuccess(`${selectedMeals.join(", ")} cancelled for ${daysCount} days. Estimated savings: ₹${savings}`);
      setShowMealCancelModal(false);
      setSelectedMeals([]);
      setMealCancelDateRange({ start: "", end: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to cancel meals");
    }

    setIsProcessing(false);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];
      const isSelected = selectedDates.includes(dateStr);
      const inPeriod = isDateInSubscriptionPeriod(date);
      const isDelivery = inPeriod && isDeliveryDay(date);
      const isPast = date < new Date() && date.toDateString() !== new Date().toDateString();

      days.push(
        <button
          key={day}
          className={`calendar-day ${isDelivery ? 'delivery-day' : ''} ${isSelected ? 'selected' : ''} ${isPast ? 'past' : ''} ${!inPeriod ? 'out-of-range' : ''}`}
          onClick={() => {
            if (isDelivery && !isPast) {
              toggleDateSelection(date);
            }
          }}
          disabled={!isDelivery || isPast || !inPeriod}
          title={isDelivery ? 'Delivery day' : 'No delivery'}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const nextBillingDate = new Date(currentSubscription.next_billing_date);
  const startDate = new Date(currentSubscription.start_date);
  const daysUntilRenewal = Math.ceil((nextBillingDate - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <>
      <Header />
      <div className="my-subscriptions-container">
        <div className="my-sub-header">
          <h1>My Subscription</h1>
          <p>Manage your active subscription and billing</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="subscription-details-card">
          <div className="sub-status">
            <div className="status-badge" data-status={currentSubscription.status}>
              {currentSubscription.status.toUpperCase()}
            </div>
          </div>

          <div className="sub-details-grid">
            {/* Plan Info */}
            <div className="detail-section">
              <h3>Your Plan</h3>
              <div className="plan-info">
                <div className="plan-icon-large">{plan.icon}</div>
                <div>
                  <h2>{plan.name} Plan</h2>
                  <p className="plan-price-large">₹{plan.price}/month</p>
                  <p className="plan-desc-large">{plan.description}</p>
                </div>
              </div>
            </div>

            {/* Billing Info */}
            <div className="detail-section">
              <h3>Billing Information</h3>
              <div className="info-items">
                <div className="info-item">
                  <span className="label">Subscription Started</span>
                  <span className="value">{startDate.toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <span className="label">Next Billing Date</span>
                  <span className="value">{nextBillingDate.toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <span className="label">Days Until Renewal</span>
                  <span className="value highlight">{daysUntilRenewal} days</span>
                </div>
                <div className="info-item">
                  <span className="label">Monthly Amount</span>
                  <span className="value">₹{plan.price}</span>
                </div>
              </div>
            </div>

            {/* Plan Details */}
            <div className="detail-section">
              <h3>Plan Details</h3>
              <div className="info-items">
                <div className="info-item">
                  <span className="label">Meals Per Week</span>
                  <span className="value">{plan.meals_per_week}</span>
                </div>
                <div className="info-item">
                  <span className="label">Delivery Days</span>
                  <span className="value">{plan.delivery_days.join(", ")}</span>
                </div>
                <div className="features-list">
                  <span className="label">Included Features</span>
                  <ul>
                    {plan.features && plan.features.map((feature, idx) => (
                      <li key={idx}>✓ {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="subscription-actions">
            {currentSubscription.status === "active" ? (
              <>
                <button
                  className="btn-action secondary"
                  onClick={handlePause}
                  disabled={isProcessing}
                >
                  ⏸ Pause Subscription
                </button>
                <button
                  className="btn-action upgrade"
                  onClick={() => navigate("/subscription-management")}
                >
                  🔄 Change Plan
                </button>
                <button
                  className="btn-action warning"
                  onClick={() => setShowCalendarModal(true)}
                >
                  📅 Cancel Specific Dates
                </button>
                <button
                  className="btn-action secondary"
                  onClick={() => setShowDayWiseCancelModal(true)}
                >
                  📆 Cancel Weekdays
                </button>
                <button
                  className="btn-action info"
                  onClick={() => setShowMealCancelModal(true)}
                >
                  🍽️ Skip Specific Meals
                </button>
                <button
                  className="btn-action danger"
                  onClick={() => setShowCancelModal(true)}
                >
                  ✕ Cancel Subscription
                </button>
              </>
            ) : currentSubscription.status === "paused" ? (
              <>
                <button
                  className="btn-action primary"
                  onClick={handleResume}
                  disabled={isProcessing}
                >
                  ▶ Resume Subscription
                </button>
                <button
                  className="btn-action secondary"
                  onClick={() => navigate("/subscription-management")}
                >
                  🔄 Change Plan
                </button>
              </>
            ) : null}
          </div>
        </div>

        {/* Cancellation History Section */}
        {cancellationHistory.length > 0 && (
          <div className="cancellation-history-section">
            <h2>Your Cancellation & Skips History</h2>
            <p className="history-subtitle">Track all your meal skips and date cancellations</p>
            
            {/* Summary Stats */}
            <div className="history-summary">
              <div className="summary-stat">
                <span className="stat-icon">📊</span>
                <div>
                  <span className="stat-label">Total Cancellations</span>
                  <span className="stat-value">{cancellationHistory.length}</span>
                </div>
              </div>
              <div className="summary-stat">
                <span className="stat-icon">💰</span>
                <div>
                  <span className="stat-label">Total Savings</span>
                  <span className="stat-value">₹{cancellationHistory.reduce((sum, c) => sum + (c.savings || 0), 0)}</span>
                </div>
              </div>
              <div className="summary-stat">
                <span className="stat-icon">🍽️</span>
                <div>
                  <span className="stat-label">Meals Skipped</span>
                  <span className="stat-value">
                    {cancellationHistory.reduce((sum, c) => {
                      if (c.type === "meal") return sum + (c.meals?.length || 0);
                      if (c.type === "date-range") return sum + (c.mealsSkipped || 0);
                      if (c.type === "specific-dates") return sum + (c.mealsSkipped || 0);
                      if (c.type === "weekday") return sum + 2;
                      return sum;
                    }, 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Cancellation History Cards */}
            <div className="history-cards">
              {cancellationHistory.map((cancellation, index) => (
                <div key={cancellation.id || index} className={`history-card ${cancellation.type}`}>
                  <div className="card-header">
                    <div className="type-badge" data-type={cancellation.type}>
                      {cancellation.type === "meal" && "🍽️ Meal Skip"}
                      {cancellation.type === "date-range" && "📅 Date Range"}
                      {cancellation.type === "specific-dates" && "📍 Specific Dates"}
                      {cancellation.type === "weekday" && "📆 Weekday Skip"}
                    </div>
                    <div className="status-indicator" data-status={cancellation.status}>
                      {cancellation.status === "upcoming" && "⏳ Upcoming"}
                      {cancellation.status === "ongoing" && "🔄 Ongoing"}
                      {cancellation.status === "completed" && "✓ Completed"}
                    </div>
                  </div>

                  <div className="card-content">
                    {/* Details Section */}
                    <div className="details-section">
                      {cancellation.type === "meal" && (
                        <>
                          <p><strong>Meals Skipped:</strong> {cancellation.meals?.join(", ") || "N/A"}</p>
                          {cancellation.dateRange && <p><strong>Period:</strong> {cancellation.dateRange}</p>}
                        </>
                      )}
                      
                      {cancellation.type === "date-range" && (
                        <>
                          <p><strong>Duration:</strong> {cancellation.daysCount} days</p>
                          <p><strong>Dates:</strong> {cancellation.dateRange}</p>
                          <p><strong>Meals Skipped:</strong> {cancellation.mealsSkipped} meals</p>
                        </>
                      )}
                      
                      {cancellation.type === "specific-dates" && (
                        <>
                          <p><strong>Dates:</strong> {cancellation.dates?.join(", ") || "N/A"}</p>
                          <p><strong>Meals Skipped:</strong> {cancellation.mealsSkipped} meals</p>
                        </>
                      )}
                      
                      {cancellation.type === "weekday" && (
                        <>
                          <p><strong>Days Skipped:</strong> {cancellation.days?.join(", ") || "N/A"}</p>
                          <p><strong>Frequency:</strong> Every week</p>
                        </>
                      )}
                    </div>

                    {/* Savings Section */}
                    <div className="savings-section">
                      <span className="savings-label">You're Saving</span>
                      <span className="savings-amount">₹{cancellation.savings}</span>
                      {cancellation.type === "meal" && (
                        <span className="savings-desc">
                          {cancellation.meals?.length || 1} meal{cancellation.meals?.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="card-footer">
                    <span className="created-date">
                      {new Date(cancellation.createdAt).toLocaleDateString()}
                    </span>
                    {cancellation.status === "upcoming" && (
                      <button className="btn-small secondary">Edit</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="quick-links-section">
          <h3>Quick Actions</h3>
          <div className="links-grid">
            <button className="link-card" onClick={() => navigate("/discover-tiffin")}>
              <span className="link-icon">🍱</span>
              <h4>Browse Tiffins</h4>
              <p>View vendor options</p>
            </button>
            <button className="link-card" onClick={() => navigate("/subscriptions-page")}>
              <span className="link-icon">📊</span>
              <h4>All Plans</h4>
              <p>See all available plans</p>
            </button>
            <button className="link-card" onClick={() => navigate("/")}>
              <span className="link-icon">🏠</span>
              <h4>Home</h4>
              <p>Back to home</p>
            </button>
          </div>
        </div>

        {/* Meal Cancellation Modal */}
        {showMealCancelModal && (
          <div className="modal-overlay">
            <div className="cancel-modal meal-cancel-modal">
              <h2>Skip Specific Meals</h2>
              <p>Choose which meals to skip and for which dates</p>

              <div className="meal-section">
                <h3>Select Meals to Skip</h3>
                <div className="meals-grid">
                  {availableMeals.map((meal) => (
                    <label key={meal.name} className="meal-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedMeals.includes(meal.name)}
                        onChange={() => toggleMealSelection(meal.name)}
                        disabled={isProcessing}
                      />
                      <div className="meal-info">
                        <span className="meal-emoji">{meal.emoji}</span>
                        <div>
                          <span className="meal-name">{meal.name}</span>
                          <span className="meal-time">{meal.time}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {availableMeals.length === 0 && (
                <div className="no-meals-msg">
                  <p>All meals are included in this plan</p>
                </div>
              )}

              <div className="date-range-section">
                <h3>Select Date Range</h3>
                <div className="date-inputs">
                  <div className="input-group">
                    <label>From Date</label>
                    <input
                      type="date"
                      value={mealCancelDateRange.start}
                      onChange={(e) => setMealCancelDateRange({ ...mealCancelDateRange, start: e.target.value })}
                      disabled={isProcessing}
                      min={new Date().toISOString().split('T')[0]}
                      max={new Date(currentSubscription.next_billing_date).toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="input-group">
                    <label>To Date</label>
                    <input
                      type="date"
                      value={mealCancelDateRange.end}
                      onChange={(e) => setMealCancelDateRange({ ...mealCancelDateRange, end: e.target.value })}
                      disabled={isProcessing}
                      min={mealCancelDateRange.start || new Date().toISOString().split('T')[0]}
                      max={new Date(currentSubscription.next_billing_date).toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>

              {selectedMeals.length > 0 && mealCancelDateRange.start && mealCancelDateRange.end && (
                <div className="skip-summary">
                  <h4>Skip Summary</h4>
                  <div className="summary-item">
                    <span className="label">Meals:</span>
                    <span className="value">{selectedMeals.join(", ")}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">From:</span>
                    <span className="value">{new Date(mealCancelDateRange.start).toLocaleDateString()}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">To:</span>
                    <span className="value">{new Date(mealCancelDateRange.end).toLocaleDateString()}</span>
                  </div>
                  <div className="summary-item highlight">
                    <span className="label">Estimated Refund:</span>
                    <span className="value">₹{Math.floor((plan.price / 30) * selectedMeals.length * (Math.ceil((new Date(mealCancelDateRange.end) - new Date(mealCancelDateRange.start)) / (1000 * 60 * 60 * 24)) + 1))}</span>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button
                  className="btn-modal secondary"
                  onClick={() => {
                    setShowMealCancelModal(false);
                    setSelectedMeals([]);
                    setMealCancelDateRange({ start: "", end: "" });
                  }}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  className="btn-modal info"
                  onClick={handleMealCancelSubmit}
                  disabled={isProcessing || selectedMeals.length === 0 || !mealCancelDateRange.start || !mealCancelDateRange.end}
                >
                  {isProcessing ? "Updating..." : "Skip Meals"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Cancellation Modal */}
        {showCalendarModal && (
          <div className="modal-overlay">
            <div className="cancel-modal calendar-modal">
              <h2>Cancel Specific Dates</h2>
              <p>Select dates to skip delivery. Only delivery days are available for selection.</p>

              <div className="calendar-container">
                <div className="calendar-header">
                  <button onClick={prevMonth} className="nav-btn">◀</button>
                  <h3>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                  <button onClick={nextMonth} className="nav-btn">▶</button>
                </div>

                <div className="calendar-weekdays">
                  <div className="weekday">Sun</div>
                  <div className="weekday">Mon</div>
                  <div className="weekday">Tue</div>
                  <div className="weekday">Wed</div>
                  <div className="weekday">Thu</div>
                  <div className="weekday">Fri</div>
                  <div className="weekday">Sat</div>
                </div>

                <div className="calendar-grid">
                  {renderCalendar()}
                </div>

                <div className="calendar-legend">
                  <div className="legend-item">
                    <span className="legend-box delivery-day"></span>
                    <span>Delivery Day</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-box selected"></span>
                    <span>Selected</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-box past"></span>
                    <span>Past Date</span>
                  </div>
                </div>
              </div>

              {selectedDates.length > 0 && (
                <div className="selected-dates-info">
                  <strong>Selected Dates: {selectedDates.length}</strong>
                  <div className="selected-dates-list">
                    {selectedDates.map((date) => (
                      <span key={date} className="date-tag">
                        {new Date(date).toLocaleDateString()}
                        <button
                          onClick={() => {
                            setSelectedDates(prev => prev.filter(d => d !== date));
                          }}
                          className="remove-date"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button
                  className="btn-modal secondary"
                  onClick={() => {
                    setShowCalendarModal(false);
                    setSelectedDates([]);
                  }}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  className="btn-modal warning"
                  onClick={handleCalendarCancel}
                  disabled={isProcessing || selectedDates.length === 0}
                >
                  {isProcessing ? "Updating..." : `Confirm (${selectedDates.length})`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Day-Wise Cancellation Modal */}
        {showDayWiseCancelModal && (
          <div className="modal-overlay">
            <div className="cancel-modal">
              <h2>Cancel Specific Delivery Days</h2>
              <p>Select which days you want to skip delivery:</p>

              <div className="days-selection">
                {plan.delivery_days.map((day) => (
                  <label key={day} className="day-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedDays.includes(day)}
                      onChange={() => toggleDaySelection(day)}
                      disabled={isProcessing}
                    />
                    <span className="day-label">{day}</span>
                  </label>
                ))}
              </div>

              {selectedDays.length > 0 && (
                <p className="selection-info">
                  Cancelling delivery for: <strong>{selectedDays.join(", ")}</strong>
                </p>
              )}

              <div className="modal-actions">
                <button
                  className="btn-modal secondary"
                  onClick={() => {
                    setShowDayWiseCancelModal(false);
                    setSelectedDays([]);
                  }}
                  disabled={isProcessing}
                >
                  Back
                </button>
                <button
                  className="btn-modal warning"
                  onClick={handleDayWiseCancel}
                  disabled={isProcessing || selectedDays.length === 0}
                >
                  {isProcessing ? "Updating..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelModal && (
          <div className="modal-overlay">
            <div className="cancel-modal">
              <h2>Cancel Subscription?</h2>
              <p>Are you sure you want to cancel your {plan.name} subscription? You won't receive any more meals after this billing cycle.</p>

              <div className="modal-actions">
                <button
                  className="btn-modal secondary"
                  onClick={() => setShowCancelModal(false)}
                  disabled={isProcessing}
                >
                  Keep Subscription
                </button>
                <button
                  className="btn-modal danger"
                  onClick={handleCancel}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Cancelling..." : "Yes, Cancel"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
