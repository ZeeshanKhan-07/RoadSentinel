import React, { useState } from "react";
import Hero from "../../components/Hero/Hero";
import { AuthModal } from "../../components/Navbar/Navbar";

const Home = () => {

  const [authModal, setAuthModal] = useState(null);

  const openAuth = (mode) => {
    setAuthModal(mode);
  };

  const closeAuth = () => {
    setAuthModal(null);
  };

  return (
    <div className="min-h-screen w-full" style={{ background: "#080808" }}>
      <Hero openAuth={openAuth} />

      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={closeAuth}
          onSwitch={openAuth}
        />
      )}
    </div>
  );
};

export default Home;