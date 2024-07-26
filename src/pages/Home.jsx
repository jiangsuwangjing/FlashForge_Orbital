import React from "react";
import Header from "../components/profile/Header";

export default function Home() {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Header />
      <div style={{ paddingTop: "90px" }}>
        <div className="container mx-4 md:mx-auto">
          <div className="text-xl font-semibold">Home</div>
        </div>
      </div>
    </div>
  );
}
