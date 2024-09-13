// PoolValue.js
import React from 'react';
import './PoolValue.css'; // Optional CSS file for styling

const PoolValue = ({ value }) => {
  return (
    <div className="pool-value">
      <h2>Pool Value: {value} Ξ</h2>
    </div>
  );
};

export default PoolValue;
