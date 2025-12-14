import { Header } from "../../component/Header.jsx";
import "./DiscoverTiffin.css";
import { Services } from "./Services.jsx";

export function DiscoverTiffin() {
  return (
    <>
      <Header />;
      <section className="discover-page">
        {/* <!-- Location Header --> */}
        <div className="location-bar">
          <p className="location-text">
            📍 Current Location: <strong>Indore, India</strong>
          </p>
          <button className="change-btn">Change</button>
        </div>

        {/* Filters Section */}
        <div className="filters-container">
          <select className="filter-select" defaultValue="">
            <option value="" disabled>
              Price Range
            </option>
            <option value="100-150">₹100 - ₹150</option>
            <option value="150-200">₹150 - ₹200</option>
            <option value="200+">₹200+</option>
          </select>

          <select className="filter-select" defaultValue="">
            <option value="" disabled>
              Food Type
            </option>
            <option>Veg</option>
            <option>Non-Veg</option>
            <option>Jain</option>
          </select>

          <select className="filter-select" defaultValue="">
            <option value="" disabled>
              Meals
            </option>
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Snacks</option>
          </select>

          <select className="filter-select" defaultValue="">
            <option value="" disabled>
              Delivery Time
            </option>
            <option>20-30 mins</option>
            <option>30-45 mins</option>
            <option>45-60 mins</option>
          </select>

          <button className="clear-filter">Clear Filters</button>
        </div>

        {/* <!-- Tiffin Service Listing --> */}
        <div className="tiffin-grid">
          <Services />
        </div>
      </section>
    </>
  );
}
