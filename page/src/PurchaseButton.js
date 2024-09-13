// PurchaseButton.js
import React from 'react';
import './PurchaseButton.css'; // Optional CSS file for styling

const PurchaseButton = ({ selectedCards }) => {
  // Function to handle purchase
  const handlePurchase = () => {
    if (selectedCards.length > 0) {
      alert(`Purchasing cards: ${selectedCards.join(', ')}`);
      // Implement actual purchase logic here (e.g., API call)
    } else {
      alert('No cards selected for purchase.');
    }
  };

  // Check if the button should be disabled
  const isDisabled = selectedCards.length === 0;

  return (
    <button
      className="purchase-button"
      onClick={handlePurchase}
      disabled={isDisabled}
    >
      {isDisabled ? 'Select Cards to Buy' : 'Buy'}
    </button>
  );
};

export default PurchaseButton;
