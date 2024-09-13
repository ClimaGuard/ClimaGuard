import React, { useState } from 'react';
import { ethers } from 'ethers'; // Use the default import for Ethers.js v6
import './PurchaseButton.css'; // Import the existing CSS file to reuse styles

const ConnectWallet = ({ onConnect }) => {
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed");
      return;
    }

    try {
      // Request account access directly from window.ethereum
      await window.ethereum.request({ method: "eth_requestAccounts" }); 

      // Instantiate the provider after requesting access
      const provider = new ethers.BrowserProvider(window.ethereum); 

      onConnect(provider); // Pass the provider to the parent component
    } catch (err) {
      console.error(err);
      setError("Failed to connect wallet");
    }
  };

  return (
    <div>
      {/* Reuse the purchase-button class for consistent styling */}
      <button className="purchase-button" onClick={connectWallet}>Connect Wallet</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default ConnectWallet;