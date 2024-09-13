import React, { useEffect, useState } from 'react';
import './PoolValue.css'; // Optional CSS file for styling

const PoolValue = ({ provider, contract }) => {
  const [poolValue, setPoolValue] = useState(0); // State to hold the pool value

  // Function to fetch the pool value from the smart contract
  const fetchPoolValue = async () => {
    if (!contract) return; // Ensure contract is loaded

    try {
      const value = await contract.poolValue(); // Fetch pool value from contract
      setPoolValue(Number(value) / 1e18); // Convert value from wei to ETH and update state
    } catch (error) {
      console.error("Error fetching pool value:", error);
    }
  };

  // Fetch pool value when the component mounts or when the provider/contract changes
  useEffect(() => {
    if (provider && contract) {
      fetchPoolValue();
    }
  }, [provider, contract]);

  return (
    <div className="pool-value">
      <h2>Pool Value: {poolValue.toFixed(4)} Ξ</h2> {/* Display pool value */}
    </div>
  );
};

export default PoolValue;