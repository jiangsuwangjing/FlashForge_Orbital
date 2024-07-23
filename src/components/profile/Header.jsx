import React from "react";
import "../../styles/Header.css";
import { auth, googleProvider } from "../../config/firebase.js";
import { signOut } from "firebase/auth";
import useAuthStore from "../../store/authStore.js";

const handleLogout = async () => {
  await signOut(auth, googleProvider);
};

function Header() {
  const user = useAuthStore((state) => state.user);
  let username, profilePicURL;
  if (user) {
    username = user.username;
    profilePicURL = user.profilePicURL;
  }
  console.log(profilePicURL);

  const toggleMenu = () => {
    const subMenu = document.getElementById("subMenu");
    subMenu.classList.toggle("open-menu");
  };
  const handleLogoutClick = (e) => {
    e.stopPropagation();
    console.log("logging out");
    handleLogout();
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
              <a href="/home">Home</a>
            </li>
            <li>
              <a href="/library">Library</a>
            </li>
            <li>
              <a href="#">Community</a>
            </li>
          </ul>
          <img src={profilePicURL} className="user-pic" onClick={toggleMenu} />
          <div className="sub-menu-wrap" id="subMenu">
            <div className="sub-menu">
              <a href="/profile" className="sub-menu-link">
                {user && (
                  <div className="user-info">
                    <img src={profilePicURL} />
                    <h2>{username}</h2>
                  </div>
                )}
              </a>
              <hr />

              <a href="/" className="sub-menu-link">
                <button onClick={(e) => handleLogoutClick(e)}>Sign Out</button>
                <span> </span>
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
