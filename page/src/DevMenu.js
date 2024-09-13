// DevMenu.js
import React, { useState } from 'react';
import './DevMenu.css'; // Optional CSS file for styling

const DevMenu = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false); // State to manage menu visibility

  // Function to toggle menu visibility
  const toggleMenu = () => {
    setIsMenuVisible((prevVisible) => !prevVisible);
  };

  return (
    <div className="dev-menu">
      {/* Dev button in the top left */}
      <button className="dev-button" onClick={toggleMenu}>
        Dev
      </button>

      {/* Menu with "Start season" and "End season" buttons */}
      {isMenuVisible && (
        <div className="dev-dropdown-menu">
          <button className="menu-button">Next Season</button>
        </div>
      )}
    </div>
  );
};

export default DevMenu;
