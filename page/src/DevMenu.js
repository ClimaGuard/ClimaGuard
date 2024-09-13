import React, { useState } from 'react';
import './DevMenu.css'; // Optional CSS file for styling
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contractConfig'; // Import the contract details
import { Contract } from 'ethers'; // Import Contract from ethers

const DevMenu = ({ provider }) => { // Accept provider as a prop
  const [isMenuVisible, setIsMenuVisible] = useState(false); // State to manage menu visibility

  // Function to toggle menu visibility
  const toggleMenu = () => {
    setIsMenuVisible((prevVisible) => !prevVisible);
  };

  // Function to call nextSeason
  const handleNextSeason = async () => {
    if (!provider) {
      alert('Wallet not connected.');
      return;
    }

    try {
      // Get the signer from the provider
      const signer = await provider.getSigner();
      // Create a contract instance with the signer
      const contractWithSigner = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Call nextSeason function
      const tx = await contractWithSigner.nextSeason();
      await tx.wait(); // Wait for the transaction to be mined

      alert('Next season has been successfully initiated!');
    } catch (error) {
      console.error('Failed to call nextSeason:', error);
      alert('Failed to initiate next season. Check the console for more details.');
    }
  };

  return (
    <div className="dev-menu">
      {/* Dev button in the top left */}
      <button className="dev-button" onClick={toggleMenu}>
        Dev
      </button>

      {/* Menu with "Next Season" button */}
      {isMenuVisible && (
        <div className="dev-dropdown-menu">
          <button className="menu-button" onClick={handleNextSeason}>Next Season</button>
        </div>
      )}
    </div>
  );
};

export default DevMenu;
