import React, { useState } from "react";
import Hero from "../../components/sections/Hero/Hero";
import Navbar, { AuthModal } from "../../components/Navbar/Navbar";
import About from "../../components/sections/About/About";
import ReviewSection from "../../components/sections/Reviews/ReviewSection";
import HowItWorks from "../../components/sections/HowItWorks/HowItWorks";
import Footer from "../../components/sections/Footer/Footer";

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
      <About />
      <HowItWorks />
      <ReviewSection />
      <Footer />

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