import React, { useState } from 'react';
import './App.css';
import Cards from './cards/Cards';
import PurchaseButton from './PurchaseButton';
import PoolValue from './PoolValue'; 
import DevMenu from './DevMenu'; // Import the DevMenu component

function App() {
  // State to manage selected cards
  const [selectedCards, setSelectedCards] = useState([]);

  // Function to handle card selection
  const handleCardSelection = (cardId) => {
    setSelectedCards((prevSelected) =>
      prevSelected.includes(cardId)
        ? prevSelected.filter((id) => id !== cardId) // Deselect card
        : [...prevSelected, cardId] // Select card
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <DevMenu /> {/* Add the DevMenu component */}
        <h1 className="season-header">Next season ☀️ Summer</h1>
        <PoolValue value={10000} /> {/* Placeholder value; replace with dynamic value later */}
        <Cards selectedCards={selectedCards} onSelectCard={handleCardSelection} />
        <PurchaseButton selectedCards={selectedCards} />
      </header>
    </div>
  );
}

export default App;
