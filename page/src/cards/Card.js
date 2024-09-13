// Card.js
import React from 'react';
import './Card.css';
import coldDry from './cold-dry.jpeg'; // Updated to use .jpeg and new path
import hotWet from  './hot-wet.jpeg'; // Updated to use .jpeg and new path
import coldWet from './cold-wet.jpeg'; // Updated to use .jpeg and new path
import hotDry from  './hot-dry.jpeg'; // Updated to use .jpeg and new path

const Card = ({ id, precipitation, temperature, isSelected, onSelect, price, quantityOwned }) => {
  // Determine the arrow direction
  const precipitationArrow = precipitation > 0 ? '↑' : '↓';
  const temperatureArrow = temperature > 0 ? '↑' : '↓';

  // Function to determine the background image based on precipitation and temperature
  const getBackgroundImage = () => {
    if (precipitation > 0 && temperature > 0) {
      return hotWet;
    } else if (precipitation > 0 && temperature < 0) {
      return coldWet;
    } else if (precipitation < 0 && temperature > 0) {
      return hotDry;
    } else {
      return coldDry;
    }
  };

  return (
    <div
      className={`card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(id)}
      style={{ backgroundImage: `url(${getBackgroundImage()})` }} // Set background image dynamically
    >
      <span>🌧️ {Math.abs(precipitation)}% {precipitationArrow}</span>
      <span>🌡️ {Math.abs(temperature)}% {temperatureArrow}</span>
      <span className="card-price">Price: {price} Ξ</span> {/* Display card price */}
      <span className="card-quantity">You own: {quantityOwned}</span> {/* Display quantity owned */}
    </div>
  );
};

export default Card;
