import React from "react";
import "../../styles/Header.css";
import { auth, googleProvider } from "../../config/firebase.js";
import { signOut } from "firebase/auth";
import useAuthStore from "../../store/authStore.js";
import { Logout } from "../../icons/logout.jsx";
import { flatMap } from "draft-js/lib/DefaultDraftBlockRenderMap.js";

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
  const handleLogoutClick = () => {
    handleLogout();
  };
  return (
    <header
      py={12}
      className="py-3 w-full top-0 fixed z-50"
      style={{
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="container mx-4 flex md:mx-auto">
        <div className="flex flex-1 flex-row w-full gap-4 items-center text-white">
          <a href="/home">Home</a>
          <a href="/library">Library</a>
        </div>
        <div className="relative flex flex-row gap-2 items-center">
          <a href="/profile">
            <img
              height={100}
              width={100}
              src={profilePicURL}
              alt="Profile Pic"
              className="w-12 h-12 object-cover rounded-full cursor-pointer"
            />
          </a>
          <a href="/">
            <div
              className="p-2 rounded-full hover:bg-white/5 cursor-pointer transition-all ripple"
              onClick={handleLogout}
            >
              <Logout />
            </div>
          </a>
          {/* <div className="sub-menu-wrap" id="subMenu">
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
          </div> */}
        </div>
        {/* </Flex> */}
      </div>
    </header>
  );
}

export default Header;
