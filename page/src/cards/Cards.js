// Cards.js
import React from 'react';
import Card from './Card';

const Cards = ({ selectedCards, onSelectCard }) => {
  // Example card data with price and quantity owned
  const cardData = [
    { id: 1, precipitation: 10, temperature: -10, price: 0.01, quantityOwned: 0 },
    { id: 2, precipitation: 10, temperature: 10, price: 0.01, quantityOwned: 0 },
    { id: 3, precipitation: -10, temperature: -10, price: 0.01, quantityOwned: 0 },
    { id: 4, precipitation: -10, temperature: 10, price: 0.01, quantityOwned: 0 },
  ];

  return (
    <div className="grid-container">
      {cardData.map((card) => (
        <div className="grid-item" key={card.id}>
          <Card
            id={card.id}
            precipitation={card.precipitation}
            temperature={card.temperature}
            isSelected={selectedCards.includes(card.id)}
            onSelect={onSelectCard}
            price={card.price} // Pass price prop
            quantityOwned={card.quantityOwned} // Pass quantityOwned prop
          />
        </div>
      ))}
    </div>
  );
};

export default Cards;