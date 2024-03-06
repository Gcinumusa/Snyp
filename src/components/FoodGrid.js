import React from 'react';
import './FoodGrid.css'; // Make sure to have a corresponding CSS file
import img from './494080e5-5fe3-456f-8129-a5eb88d5bb49.jpeg'
import logo from '../snyp.png'
const FoodGrid = () => {
  // Mock data for food items
  const foodItems = [
    {
      name: "McDonald's Old Fort Rd",
      time: "10–25 min",
      rating: 4.5,
      imageUrl: img
    }, {
        name: "McDonald's Old Fort Rd",
        time: "10–25 min",
        rating: 4.5,
        imageUrl: '../../src/494080e5-5fe3-456f-8129-a5eb88d5bb49.jpeg'
      }, {
        name: "McDonald's Old Fort Rd",
        time: "10–25 min",
        rating: 4.5,
        imageUrl: '../../src/494080e5-5fe3-456f-8129-a5eb88d5bb49.jpeg'
      }, {
        name: "McDonald's Old Fort Rd",
        time: "10–25 min",
        rating: 4.5,
        imageUrl: '../../src/494080e5-5fe3-456f-8129-a5eb88d5bb49.jpeg'
      },
    // ... other restaurant items
  ];

  return (
    <div className="food-grid">
           <header className="app-header">
        <img src={logo} alt="Logo" className="logo" />
        <input type="text" placeholder="Search food, groceries, drinks, etc" className="search-bar" />
        <div className="auth-buttons">
          <button className="sign-in-btn">Log in</button>
          <button className="sign-up-btn">Sign up</button>
        </div>
      </header>
      
      <div className="delivery-pickup-toggle">
        <button className="toggle-btn active">Delivery</button>
        <button className="toggle-btn">Pickup</button>
      </div>
      <div className="food-section">
        <h2>Quick and affordable</h2>
        <div className="food-items">
          {foodItems.map((item) => (
            <div className="food-item" key={item.name}>
              <img src={item.imageUrl} alt={item.name} />
              <div className="food-info">
                <h3>{item.name}</h3>
                <p>{item.time}</p>
                <span className="food-rating">{item.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Repeat for other sections like "In a rush?" */}
      
    </div>
  );
};

export default FoodGrid;
