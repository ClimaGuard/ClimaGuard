import React from 'react';
import './PurchaseButton.css'; // Optional CSS file for styling
import { parseEther } from 'ethers'; // Correct import for Ethers.js v6 utility functions

const PurchaseButton = ({ selectedCards, provider, contract, userAddress, updateTokenBalances }) => {
  // Function to handle purchase
  const handlePurchase = async () => {
    if (selectedCards.length === 0 || !provider || !contract) {
      alert('No cards selected for purchase or wallet not connected.');
      return;
    }

    try {
      const signer = await provider.getSigner(); // Get the signer from the provider
      const tokenPrice = parseEther("0.01"); // Assuming 0.01 ETH per token price

      // Loop through each selected card and purchase the token
      for (const tokenId of selectedCards) {
        const tx = await contract.connect(signer).buyToken(tokenId, 1, {
          value: tokenPrice,
        });
        await tx.wait(); // Wait for the transaction to be mined
      }

      alert('Tokens purchased successfully!');
      updateTokenBalances(); // Call the function to update token balances in Cards.js

    } catch (err) {
      console.error('Failed to purchase tokens:', err);
      alert('Failed to purchase tokens. Check the console for more details.');
    }
  };

  // Check if the button should be disabled
  const isDisabled = selectedCards.length === 0 || !provider || !contract;

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
