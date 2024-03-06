// components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../snypWhite.png'
import './Header.css';
function Header() {
  return (
    <header>
      {/* Header content goes here, for example, a navigation bar */}
      <nav>
        <div className="logoDiv">
               <img src={logo} alt="Logo" className="logo" />
        </div>
   
      </nav>
    </header>
  );
}

export default Header;
