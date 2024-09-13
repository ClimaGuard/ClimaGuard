import React, { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers'; // Import the correct named imports for ethers
import './App.css';
import Cards from './cards/Cards';
import PurchaseButton from './PurchaseButton';
import PoolValue from './PoolValue';
import DevMenu from './DevMenu'; // Import the DevMenu component
import { getContractInstanceWithProvider } from './contractConfig'; // Import contract configuration

function App() {
  const [provider, setProvider] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [cardData, setCardData] = useState([
    { id: 1, precipitation: 10, temperature: -10, price: 0.01, quantityOwned: 0 },
    { id: 2, precipitation: 10, temperature: 10, price: 0.01, quantityOwned: 0 },
    { id: 3, precipitation: -10, temperature: -10, price: 0.01, quantityOwned: 0 },
    { id: 4, precipitation: -10, temperature: 10, price: 0.01, quantityOwned: 0 },
  ]);

  // Function to connect wallet and initialize provider and contract
  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum); // Correct usage for v6
      await window.ethereum.request({ method: "eth_requestAccounts" }); // Request account access
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const contract = getContractInstanceWithProvider(provider); // Initialize contract instance

      setProvider(provider);
      setUserAddress(userAddress);
      setContract(contract);
    } else {
      alert('Please install MetaMask!');
    }
  };

  // Function to handle card selection
  const handleCardSelection = (cardId) => {
    setSelectedCards((prevSelected) =>
      prevSelected.includes(cardId)
        ? prevSelected.filter((id) => id !== cardId)
        : [...prevSelected, cardId]
    );
  };

  // Function to update token balances after purchase
  const updateTokenBalances = async () => {
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

  useEffect(() => {
    if (provider && contract && userAddress) {
      updateTokenBalances(); // Fetch initial token balances
    }
  }, [provider, contract, userAddress]);

  return (
    <div className="App">
  <header className="App-header">
    {provider && userAddress ? (
      <>
        <DevMenu />
        <h1 className="season-header">Next season ☀️ Summer</h1>
        {/* Pass the provider and contract as props */}
        <PoolValue provider={provider} contract={contract} />
        {/* Pass provider, contract, and userAddress to Cards component */}
        <Cards
          selectedCards={selectedCards}
          onSelectCard={handleCardSelection}
          provider={provider}
          contract={contract}
          userAddress={userAddress}
        />
        {/* Pass the necessary props to PurchaseButton */}
        <PurchaseButton
          selectedCards={selectedCards}
          provider={provider}
          contract={contract}
          userAddress={userAddress}
          updateTokenBalances={updateTokenBalances} // Pass updateTokenBalances to refresh card data
        />
      </>
    ) : (
      <button onClick={connectWallet} className="purchase-button">
        Connect Wallet
      </button>
    )}
  </header>
</div>
  );
}

export default App;
