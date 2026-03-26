import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../auth/store";
import toast from "react-hot-toast";
import { gsap } from "gsap";
import Login from "../../pages/login/login";
import Register from "../../pages/register/register";
function LogoIcon({ size = 32 }) {
  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{ width: size, height: size, background: "#fff", borderRadius: 4 }}
    >
      <svg
        width={size * 0.56}
        height={size * 0.56}
        viewBox="0 0 18 18"
        fill="none"
      >
        <path
          d="M2 2 L8 9 L2 16 L4 16 L9 10.5 L14 16 L16 16 L10 9 L16 2 L14 2 L9 7.5 L4 2 Z"
          fill="#0a0a0a"
        />
      </svg>
    </div>
  );
}

function SendIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path
        d="M1 12 L12 1 M12 1 H6 M12 1 V7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 3H5L6.5 13H18L20 7H7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="20" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4 20C4 16.7 7.1 14 12 14C16.9 14 20 16.7 20 20"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// ── Auth Modal ─────────────────────────────────────────────────
export function AuthModal({ mode, onClose, onSwitch }) {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    // Animate IN
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: "power2.out" },
    );
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 24, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" },
    );
  }, []);

  const handleClose = () => {
    gsap.to(cardRef.current, {
      opacity: 0,
      y: 16,
      scale: 0.97,
      duration: 0.25,
      ease: "power2.in",
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) handleClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        ref={cardRef}
        style={{
          position: "relative",
          background: "#0f0f0f",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "18px",
          padding: "36px 32px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "30px",
            height: "30px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.5)",
            cursor: "pointer",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.12)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
          }}
        >
          ✕
        </button>

        {mode === "login" ? (
          <Login
            onClose={handleClose}
            onSwitchToRegister={() => onSwitch("register")}
          />
        ) : (
          <Register
            onClose={handleClose}
            onSwitchToLogin={() => onSwitch("login")}
          />
        )}
      </div>
    </div>
  );
}

// ── Mobile Drawer ──────────────────────────────────────────────
function MobileDrawer({
  navLinks,
  activeLink,
  setActiveLink,
  onClose,
  onOpenAuth,
}) {
  const drawerRef = useRef(null);
  const linksRef = useRef([]);
  const actionsRef = useRef([]);

  useEffect(() => {
    const drawer = drawerRef.current;
    gsap.set(drawer, { y: "-100%" });
    const tl = gsap.timeline();
    tl.to(drawer, { y: "0%", duration: 0.4, ease: "power3.out" });
    tl.fromTo(
      linksRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, stagger: 0.08, ease: "power2.out" },
      "-=0.15",
    );
    tl.fromTo(
      actionsRef.current,
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, stagger: 0.07, ease: "power2.out" },
      "-=0.1",
    );
  }, []);

  const handleClose = () => {
    gsap.to(drawerRef.current, {
      y: "-100%",
      duration: 0.3,
      ease: "power3.in",
      onComplete: onClose,
    });
  };

  return (
    <div
      ref={drawerRef}
      className="fixed inset-0 z-40 flex flex-col"
      style={{
        background: "#0a0a0a",
        paddingTop: "56px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <button
        onClick={handleClose}
        className="absolute top-3.5 right-4 flex items-center justify-center w-9 h-9 border border-white/20 rounded text-white/60 hover:text-white hover:border-white/45 transition-all cursor-pointer text-base"
        aria-label="Close menu"
      >
        ✕
      </button>
      <ul className="flex flex-col items-center justify-center gap-0.5 flex-1 pt-10 pb-4">
        {navLinks.map((link, i) => (
          <li
            key={link}
            ref={(el) => (linksRef.current[i] = el)}
            className="w-full text-center"
          >
            <button
              onClick={() => {
                setActiveLink(link);
                handleClose();
              }}
              className={`w-full py-3.5 text-base font-medium transition-colors duration-200 cursor-pointer ${activeLink === link ? "text-white" : "text-white/40 hover:text-white/80"}`}
            >
              {link}
            </button>
          </li>
        ))}
      </ul>
      <div className="mx-6 h-px bg-white/10" />
      <div className="flex flex-col items-center gap-4 px-6 py-8">
        <button
          ref={(el) => (actionsRef.current[0] = el)}
          className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <SendIcon /> Submit
        </button>
        <div
          ref={(el) => (actionsRef.current[1] = el)}
          className="flex items-center gap-3 w-full justify-center"
        >
          <button
            onClick={() => {
              handleClose();
              setTimeout(() => onOpenAuth("login"), 350);
            }}
            className="px-5 py-2 text-sm font-bold text-white border border-white/25 rounded hover:border-white/50 transition-colors cursor-pointer"
          >
            Sign in
          </button>
          <button
            onClick={() => {
              handleClose();
              setTimeout(() => onOpenAuth("register"), 350);
            }}
            className="px-5 py-2 text-sm font-bold bg-white text-black rounded hover:bg-white/90 transition-colors cursor-pointer"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Navbar ────────────────────────────────────────────────
export default function Navbar() {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);
  const actionsRef = useRef([]);

  const [activeLink, setActiveLink] = useState("Templates");
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null); // "login" | "register" | null

  const navLinks = ["About", "How to use?", "Contact", "Reviews"];

  const location = useLocation();

  const navigate = useNavigate();
  const isLoggedIn = useAuth((state) => state.authStatus);
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);

  useEffect(() => {
    // 1. Only run if we have the 'triggerLogin' flag and user isn't logged in
    if (location.state?.triggerLogin && !isLoggedIn) {
      // 2. Open the modal
      setAuthModal("login");

      // 3. IMPORTANT: Wipe the state immediately!
      // This changes the URL state to {} so a refresh won't find 'triggerLogin'
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, isLoggedIn, navigate]);

  const handleLogOut = () => {
    toast.success("Successfully logged out!");
    logout();
  };

  const openAuth = (mode) => setAuthModal(mode);
  const closeAuth = () => setAuthModal(null);
  const switchAuth = (mode) => setAuthModal(mode);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        navRef.current,
        { y: -70, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, ease: "power3.out" },
      );
      tl.fromTo(
        logoRef.current,
        { x: -24, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
        "-=0.3",
      );
      tl.fromTo(
        linksRef.current,
        { y: -12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.42, stagger: 0.07, ease: "power2.out" },
        "-=0.28",
      );
      tl.fromTo(
        actionsRef.current,
        { x: 18, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.42, stagger: 0.09, ease: "power2.out" },
        "-=0.32",
      );
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const handler = (e) => {
      if (e.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 border-b border-white/10"
        style={{
          background: "#0a0a0a",
          height: "56px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Logo */}
        <Link
          ref={logoRef}
          to="/"
          className="flex items-center gap-2.5 shrink-0"
        >
          <LogoIcon />
          <span
            className="text-white font-bold"
            style={{ fontSize: "1.1rem", letterSpacing: "-0.01em" }}
          >
            RoadSentinel
          </span>
        </Link>

        {/* Desktop center links */}
        <ul className="hidden min-[900px]:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link, i) => (
            <li key={link} ref={(el) => (linksRef.current[i] = el)}>
              <button
                onClick={() => setActiveLink(link)}
                className={`px-3.5 py-1.5 text-sm font-medium rounded transition-all duration-200 cursor-pointer ${activeLink === link ? "bg-white/15 text-white" : "text-white/50 hover:text-white/85"}`}
              >
                {link}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop right actions */}
        <div className="hidden min-[900px]:flex items-center gap-6">
          {/* Store button always visible */}
          <button
            ref={(el) => (actionsRef.current[0] = el)}
            onClick={() => navigate("/store")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded border border-white/30 text-white hover:border-white/55 hover:bg-white/5 transition-all duration-200 cursor-pointer"
          >
            <CartIcon /> Store
          </button>

          {isLoggedIn ? (
            <div className="relative group">
              {/* Circular Profile Button */}
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-white/30 text-white hover:border-white/60 hover:bg-white/10 transition-all duration-200"
              >
                <ProfileIcon />
              </button>

              {/* Hover Tooltip */}
              <span
                className="
        absolute -bottom-7 left-1/2 -translate-x-1/2
        text-xs text-white/80 bg-black/80
        px-2 py-1 rounded
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        whitespace-nowrap
      "
              >
                Profile
              </span>
            </div>
          ) : (
            <>
              <button
                onClick={() => openAuth("login")}
                className="px-3.5 py-1.5 text-sm font-medium rounded text-white/65 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
              >
                Sign in
              </button>

              <button
                onClick={() => openAuth("register")}
                className="px-3.5 py-1.5 text-sm font-medium rounded bg-white text-black hover:bg-white/90 transition-all duration-200 cursor-pointer"
              >
                Create Account
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="min-[900px]:hidden flex flex-col justify-center items-center gap-[5px] w-9 h-9 cursor-pointer"
          aria-label="Toggle menu"
        >
          <span
            className="block h-px bg-white transition-all duration-300 origin-center"
            style={{
              width: 22,
              transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="block h-px bg-white transition-all duration-300"
            style={{ width: 22, opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block h-px bg-white transition-all duration-300 origin-center"
            style={{
              width: 22,
              transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <MobileDrawer
          navLinks={navLinks}
          activeLink={activeLink}
          setActiveLink={setActiveLink}
          onClose={() => setMenuOpen(false)}
          onOpenAuth={openAuth}
        />
      )}

      {/* Auth Modal */}
      {authModal && (
        <AuthModal mode={authModal} onClose={closeAuth} onSwitch={switchAuth} />
      )}
    </>
  );
}
