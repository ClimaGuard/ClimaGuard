import React, { useEffect, useState } from 'react';
import Card from './Card';

const Cards = ({ selectedCards, onSelectCard, provider, contract, userAddress }) => {
  const [cardData, setCardData] = useState([
    { id: 1, precipitation: 10, temperature: -10, price: 0.01, quantityOwned: 0 },
    { id: 2, precipitation: 10, temperature: 10, price: 0.01, quantityOwned: 0 },
    { id: 3, precipitation: -10, temperature: -10, price: 0.01, quantityOwned: 0 },
    { id: 4, precipitation: -10, temperature: 10, price: 0.01, quantityOwned: 0 },
  ]);

  // Function to fetch token balances from the smart contract
  const fetchTokenBalances = async () => {
    if (!contract || !userAddress) return; // Ensure contract and userAddress are available

    try {
      const updatedCardData = await Promise.all(
        cardData.map(async (card) => {
          const balance = await contract.balanceOf(userAddress, card.id); // Fetch balance for each token ID
          return { ...card, quantityOwned: Number(balance) }; // Update quantity owned
        })
      );

      setCardData(updatedCardData); // Update state with fetched balances
    } catch (error) {
      console.error('Error fetching token balances:', error);
    }
  };

  // Fetch token balances when the component mounts or when the contract/userAddress changes
  useEffect(() => {
    if (provider && contract && userAddress) {
      fetchTokenBalances();
    }
  }, [provider, contract, userAddress]);

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
            quantityOwned={card.quantityOwned} // Pass dynamic quantityOwned prop
          />
        </div>
      ))}
    </div>
  );
};

export default Cards;
