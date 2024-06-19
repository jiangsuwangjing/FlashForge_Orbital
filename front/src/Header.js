import React from "react";
import "./Header.css";
import profile from "./assets/profile.png";
function Header() {
  const toggleMenu = () => {
    const subMenu = document.getElementById("subMenu");
    subMenu.classList.toggle("open-menu");
  };
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
        <nav>
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Library</a>
            </li>
            <li>
              <a href="#">Community</a>
            </li>
          </ul>
          <img src={profile} class="user-pic" onClick={toggleMenu} />
          <div className="sub-menu-wrap" id="subMenu">
            <div className="sub-menu">
              <div className="user-info">
                <img src={profile} />
                <h2>John Doe</h2>
              </div>
              <hr />
              <a href="#" className="sub-menu-link">
                <p>My Profile</p>
                <span> > </span>
              </a>

              <a href="#" className="sub-menu-link">
                <p>Settings</p>
                <span> > </span>
              </a>

              <a href="#" className="sub-menu-link">
                <p>Sign Out</p>
                <span> > </span>
              </a>
            </div>
          </div>
        </nav>

        {/* <div className="dropdown">
          <div className="dropdown-content">
            <a href="#">My Profile</a>
            <a href="#">Settings</a>
            <a href="#">Sign Out</a>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Header;
