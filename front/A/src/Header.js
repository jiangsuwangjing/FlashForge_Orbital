import React from "react";
import "./Header.css";
function Header() {
  return (
    <div className="navbar">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for cards in your library"
          className="search-input"
        />
      </div>
      <div>
        <ul>
          <li>
            <a href="#" className="link">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="link">
              Library
            </a>
          </li>
          <li>
            <a href="#" className="link">
              Community
            </a>
          </li>
        </ul>
        <div className="dropdown">
          <button className="dropbtn">☰</button>
          <div className="dropdown-content">
            <a href="#">My Profile</a>
            <a href="#">Settings</a>
            <a href="#">Sign Out</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
