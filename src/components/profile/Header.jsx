import React from "react";
import "../../styles/Header.css";
import { auth, googleProvider } from "../../config/firebase.js";
import { signOut } from "firebase/auth";
import useAuthStore from "../../store/authStore.js";
import { Avatar } from "@chakra-ui/react";

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
      <div style={{ marginLeft: "auto" }}>
        <nav>
          <ul>
            <li>
              <a href="/home">Home</a>
            </li>
            <li>
              <a href="/library">Library</a>
            </li>
          </ul>
          <div style={{ display: "flex", alignItems: "center", gap: "45px" }}>
            <a href="/profile">
              <Avatar
                size={"md"}
                src={profilePicURL}
                className="user-pic"
                onClick={toggleMenu}
                borderRadius={"50%"}
              />
            </a>

            <a href="/" className="sub-menu-link">
              <button
                style={{ border: "none", width: "104px" }}
                onClick={(e) => handleLogoutClick(e)}
              >
                Sign Out
              </button>
            </a>
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
