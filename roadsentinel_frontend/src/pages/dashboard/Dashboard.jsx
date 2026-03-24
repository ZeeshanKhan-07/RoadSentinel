// Dashboard.jsx
// User dashboard — profile, stats, quick-action tiles, quote banner.
// Dependencies: React, React Router, Tailwind CSS, GSAP, react-hot-toast
// Services: userService.js (getTotalComplaints, getSuccessedComplaints)

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import useAuth from "../../auth/store";
import { getTotalComplaints, getSuccessedComplaints } from "../../services/userService";

// ── Helpers ───────────────────────────────────────────────────
const BASE_URL = "http://localhost:8080";

function fmt(n) {
  if (n === null || n === undefined) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

// ── Stat row item inside profile card ────────────────────────
function StatRow({ icon, label, value, valueColor }) {
  return (
    <div className="flex items-center justify-between py-2"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="flex items-center gap-2">
        <span style={{ color: "#6b7280" }}>{icon}</span>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.75rem,1.3vw,0.85rem)", color: "#9ca3af" }}>
          {label}
        </span>
      </div>
      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.75rem,1.3vw,0.85rem)", fontWeight: 700, color: valueColor || "#fff" }}>
        {value}
      </span>
    </div>
  );
}

// ── Quick action tile ─────────────────────────────────────────
function Tile({ icon, label, sub, accent, onClick, tileRef }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={tileRef}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col justify-between cursor-pointer select-none"
      style={{
        background: hovered ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.03)",
        border: hovered
          ? `1.5px solid ${accent}55`
          : "1.5px solid rgba(120,120,130,0.2)",
        borderRadius: 14,
        padding: "clamp(1rem,2.5vw,1.4rem)",
        transition: "background 0.22s, border-color 0.22s, transform 0.2s, box-shadow 0.22s",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? `0 8px 28px rgba(0,0,0,0.4)` : "none",
        minHeight: 130,
      }}
    >
      {/* Icon circle */}
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        background: `${accent}1a`,
        border: `1.5px solid ${accent}33`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: accent,
        marginBottom: "auto",
      }}>
        {icon}
      </div>

      <div style={{ marginTop: "1.2rem" }}>
        <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "clamp(1rem,2vw,1.25rem)", color: "#fff", letterSpacing: "-0.01em" }}>
          {sub}
        </div>
        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.72rem,1.2vw,0.82rem)", color: "#6b7280", marginTop: "0.15rem", letterSpacing: "0.02em" }}>
          {label}
        </div>
      </div>
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────
function Avatar({ src, name, size = 72 }) {
  const [imgError, setImgError] = useState(false);
  const initials = (name || "U").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  if (src && !imgError) {
    return (
      <img
        src={src.startsWith("http") ? src : `${BASE_URL}${src}`}
        alt={name}
        onError={() => setImgError(true)}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: "2.5px solid rgba(255,255,255,0.12)", flexShrink: 0 }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
      border: "2.5px solid rgba(255,255,255,0.12)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter',sans-serif", fontWeight: 800,
      fontSize: size * 0.35, color: "#fff", letterSpacing: "0.02em",
    }}>
      {initials}
    </div>
  );
}

// ── Quote banner ──────────────────────────────────────────────
function QuoteBanner({ name }) {
  const first = (name || "there").split(" ")[0];
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 60%,#a78bfa 100%)",
        borderRadius: 16,
        padding: "clamp(1.4rem,3vw,2rem) clamp(1.4rem,3vw,2rem)",
        minHeight: 140,
      }}
    >
      {/* Decorative blobs */}
      <div style={{ position:"absolute", right:-30, top:-30, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.08)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", right:60, bottom:-40, width:110, height:110, borderRadius:"50%", background:"rgba(255,255,255,0.06)", pointerEvents:"none" }}/>
      {/* Decorative triangles */}
      <svg style={{ position:"absolute", right:"8%", bottom:0, opacity:0.13, pointerEvents:"none" }} width="90" height="70" viewBox="0 0 90 70">
        <polygon points="45,0 90,70 0,70" fill="white"/>
      </svg>
      <svg style={{ position:"absolute", right:"20%", bottom:10, opacity:0.08, pointerEvents:"none" }} width="55" height="45" viewBox="0 0 55 45">
        <polygon points="27,0 55,45 0,45" fill="white"/>
      </svg>

      {/* Speedometer-style icon */}
      <div style={{ position:"absolute", right:"clamp(1rem,6vw,5rem)", top:"50%", transform:"translateY(-50%)", opacity:0.25, pointerEvents:"none" }}>
        <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
          <circle cx="45" cy="45" r="40" stroke="white" strokeWidth="3" fill="none"/>
          <path d="M45 45 L65 25" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="45" cy="45" r="5" fill="white"/>
          <path d="M15 60 A35 35 0 0 1 75 60" stroke="white" strokeWidth="2.5" fill="none" strokeDasharray="4 3"/>
        </svg>
      </div>

      <div style={{ position:"relative", zIndex:1, maxWidth:"65%" }}>
        <h2 style={{ fontFamily:"'Inter',sans-serif", fontWeight:800, fontSize:"clamp(1rem,2.5vw,1.4rem)", color:"#0f0f0f", lineHeight:1.35, marginBottom:"0.6rem" }}>
          Welcome back, {first}! Let's report violations and make roads safer today.
        </h2>
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.75rem,1.3vw,0.88rem)", color:"rgba(0,0,0,0.6)", lineHeight:1.5 }}>
          Every report you file brings us one step closer to safer roads for everyone.
        </p>
      </div>
    </div>
  );
}

// ── Profile card (reused on both mobile inline + desktop sidebar) ─
function ProfileCard({ userAvatar, userName, userEmail, statsLoading, totalComplaints, successedComplaints, navigate, handleLogout }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.025)",
      border: "1.5px solid rgba(120,120,130,0.18)",
      borderRadius: 16,
      padding: "1.25rem",
    }}>
      {/* Avatar + name row */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar src={userAvatar} name={userName} size={58} />
        <div className="min-w-0">
          <h3 style={{ fontFamily:"'Inter',sans-serif", fontWeight:800, fontSize:"clamp(0.95rem,1.8vw,1.05rem)", color:"#fff", letterSpacing:"-0.01em", marginBottom:"0.1rem", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
            {userName}
          </h3>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.7rem,1.2vw,0.78rem)", color:"#6b7280", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
            {userEmail || "No email on file"}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height:1, background:"rgba(255,255,255,0.07)", marginBottom:"0.85rem" }}/>

      {/* Stat rows */}
      <div>
        <StatRow
          icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L8.6 5.2H13L9.5 7.8L10.8 12L7 9.4L3.2 12L4.5 7.8L1 5.2H5.4L7 1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>}
          label="Earned Reward" value="₹500" valueColor="#34d399"
        />
        <StatRow
          icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1C4.2 1 2 3.2 2 6C2 9 7 13 7 13C7 13 12 9 12 6C12 3.2 9.8 1 7 1Z" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="6" r="1.8" stroke="currentColor" strokeWidth="1.3"/></svg>}
          label="Registered Complaints" value={statsLoading ? "…" : fmt(totalComplaints)} valueColor="#f59e0b"
        />
        <StatRow
          icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M4.5 7L6 8.5L9.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          label="Successed Complaints" value={statsLoading ? "…" : fmt(successedComplaints)} valueColor="#34d399"
        />
      </div>

      {/* Divider */}
      <div style={{ height:1, background:"rgba(255,255,255,0.07)", margin:"0.85rem 0" }}/>

      {/* Quick links */}
      <div className="flex flex-col gap-2">
        <button onClick={() => navigate("/complaints")}
          className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all hover:opacity-80 cursor-pointer"
          style={{ background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.2)" }}>
          <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.78rem", fontWeight:600, color:"#f59e0b" }}>View All Complaints</span>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5H11M11 6.5L7.5 3M11 6.5L7.5 10" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button onClick={() => navigate("/raiseChallanRequestOptions")}
          className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all hover:opacity-80 cursor-pointer"
          style={{ background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.2)" }}>
          <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.78rem", fontWeight:600, color:"#818cf8" }}>Raise New Complaint</span>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2V11M2 6.5H11" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
        <button onClick={handleLogout}
          className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all hover:opacity-80 cursor-pointer"
          style={{ background:"rgba(248,113,113,0.07)", border:"1px solid rgba(248,113,113,0.18)" }}>
          <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.78rem", fontWeight:600, color:"#f87171" }}>Logout</span>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M5 2H2C1.4 2 1 2.4 1 3V10C1 10.6 1.4 11 2 11H5" stroke="#f87171" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M8.5 4.5L12 6.5M12 6.5L8.5 8.5M12 6.5H5" stroke="#f87171" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────
export default function Dashboard() {
  const navigate  = useNavigate();
  const logout    = useAuth((state) => state.logout);
  const user      = useAuth((state) => state.user);

  const userId    = user?.id;
  const userName  = user?.name || user?.fullName || user?.username || "User";
  const userEmail = user?.email || "";
  const userAvatar= user?.profileImage || user?.avatar || user?.profilePic || null;

  const wrapperRef  = useRef(null);
  const bannerRef   = useRef(null);
  const profileRef  = useRef(null);
  const tilesRef    = useRef([]);
  const statsRef    = useRef(null);

  const [totalComplaints,     setTotalComplaints]     = useState(null);
  const [successedComplaints, setSuccessedComplaints] = useState(null);
  const [statsLoading,        setStatsLoading]        = useState(true);

  // ── Fetch stats ─────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    (async () => {
      setStatsLoading(true);
      const [t, s] = await Promise.all([
        getTotalComplaints(userId),
        getSuccessedComplaints(userId),
      ]);
      setTotalComplaints(t.total);
      setSuccessedComplaints(s.total);
      setStatsLoading(false);
    })();
  }, [userId]);

  // ── GSAP entrance ───────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(bannerRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      );
      if (profileRef.current) {
        tl.fromTo(profileRef.current,
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.55 },
          "-=0.35"
        );
      }
      tl.fromTo(
        tilesRef.current.filter(Boolean),
        { y: 45, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 },
        "-=0.2"
      );
      tl.fromTo(statsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45 },
        "-=0.25"
      );
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  // ── Logout ──────────────────────────────────────────────────
  const handleLogout = () => {
    toast.success("Successfully logged out!");
    logout();
    navigate("/");
  };

  // ── Tiles config ────────────────────────────────────────────
  const TILES = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2L12.4 7.5H18L13.5 11L15.3 17L10 13.5L4.7 17L6.5 11L2 7.5H7.6L10 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        </svg>
      ),
      label: "Earned Reward",
      sub: "",
      accent: "#34d399",
      onClick: () => {},
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M6 7H14M6 10H11M6 13H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      label: "See All Orders",
      sub: "Orders",
      accent: "#60a5fa",
      onClick: () => navigate("/orders"),
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2C6.13 2 3 5.13 3 9C3 13 10 19 10 19C10 19 17 13 17 9C17 5.13 13.87 2 10 2Z" stroke="currentColor" strokeWidth="1.6"/>
          <circle cx="10" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      label: "All Complaints",
      sub: statsLoading ? "—" : fmt(totalComplaints),
      accent: "#f59e0b",
      onClick: () => navigate("/complaints"),
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: "Accuracy",
      sub: "Coming Soon",
      accent: "#a78bfa",
      onClick: () => toast("Accuracy feature coming soon!", { icon: "🚀" }),
    },
  ];

  return (
    <div
      ref={wrapperRef}
      className="min-h-screen w-full"
      style={{ background: "#080808", fontFamily: "'Inter',sans-serif" }}
    >
      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shimmer {
          0%{background-position:-400px 0}
          100%{background-position:400px 0}
        }
        .shimmer {
          background: linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%);
          background-size: 400px 100%;
          animation: shimmer 1.4s infinite;
        }
      `}</style>

      {/* ── Top bar ── */}
      <div
        className="w-full sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8"
        style={{
          background: "rgba(8,8,8,0.92)",
          backdropFilter: "blur(14px)",
          height: "clamp(52px,8vw,62px)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div style={{ width:28, height:28, background:"#fff", borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M2 2 L8 9 L2 16 L4 16 L9 10.5 L14 16 L16 16 L10 9 L16 2 L14 2 L9 7.5 L4 2 Z" fill="#080808"/>
            </svg>
          </div>
          <span style={{ color:"#fff", fontWeight:800, fontSize:"clamp(0.9rem,2vw,1.05rem)", letterSpacing:"-0.01em" }}>
            RoadSentinel
          </span>
        </div>

        {/* Right: user name + logout */}
        <div className="flex items-center gap-3">
          <span style={{ color:"#6b7280", fontSize:"clamp(0.72rem,1.2vw,0.82rem)", fontWeight:500 }}
            className="hidden sm:block">
            {userName}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 transition-all hover:opacity-80 active:scale-95 cursor-pointer"
            style={{
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: 7,
              color: "#f87171",
              fontFamily: "'Inter',sans-serif",
              fontSize: "clamp(0.7rem,1.2vw,0.8rem)",
              fontWeight: 600,
              padding: "0.38rem 0.85rem",
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M5 2H2C1.4 2 1 2.4 1 3V10C1 10.6 1.4 11 2 11H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M8.5 4.5L12 6.5M12 6.5L8.5 8.5M12 6.5H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* ── Page content ── */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8"
        style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* ── Main grid: left content + right profile card ── */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-5 flex-1 min-w-0">

            {/* Quote banner */}
            <div ref={bannerRef} style={{ opacity: 0 }}>
              <QuoteBanner name={userName} />
            </div>

            {/* ── Profile card — visible ONLY on mobile (below banner) ── */}
            <div className="block lg:hidden">
              <ProfileCard
                userAvatar={userAvatar}
                userName={userName}
                userEmail={userEmail}
                statsLoading={statsLoading}
                totalComplaints={totalComplaints}
                successedComplaints={successedComplaints}
                navigate={navigate}
                handleLogout={handleLogout}
              />
            </div>

            {/* Quick tiles — 2×2 on mobile, 4 cols on md+ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {TILES.map((tile, i) => (
                <Tile
                  key={tile.label}
                  {...tile}
                  tileRef={(el) => (tilesRef.current[i] = el)}
                />
              ))}
            </div>

            {/* Recent activity */}
            <div ref={statsRef} style={{ opacity: 0 }}>
              <div style={{
                background: "rgba(255,255,255,0.025)",
                border: "1.5px solid rgba(120,120,130,0.18)",
                borderRadius: 14,
                padding: "clamp(1rem,2.5vw,1.4rem)",
              }}>
                <div className="flex items-center justify-between mb-4">
                  <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.65rem,1.1vw,0.72rem)", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4b5563" }}>
                    Recent Activity
                  </span>
                  <button
                    onClick={() => navigate("/complaints")}
                    className="flex items-center gap-1 hover:opacity-75 transition-opacity cursor-pointer"
                    style={{ background:"none", border:"none", color:"#6b7280", fontFamily:"'Inter',sans-serif", fontSize:"0.75rem", fontWeight:600, cursor:"pointer" }}
                  >
                    View All
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6H10M10 6L7 3M10 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                {/* Quick stat pills */}
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "Total Registered",  value: statsLoading ? "…" : fmt(totalComplaints),     color: "#f59e0b", bg: "rgba(245,158,11,0.1)",   border: "rgba(245,158,11,0.25)"  },
                    { label: "Successed",          value: statsLoading ? "…" : fmt(successedComplaints), color: "#34d399", bg: "rgba(52,211,153,0.1)",   border: "rgba(52,211,153,0.25)"  },
                    { label: "Earned Reward",      value: "₹500",                                          color: "#34d399", bg: "rgba(52,211,153,0.07)",  border: "rgba(52,211,153,0.18)"  },
                  ].map((stat) => (
                    <div key={stat.label} style={{
                      background: stat.bg,
                      border: `1px solid ${stat.border}`,
                      borderRadius: 10, padding: "0.6rem 1rem",
                      display: "flex", flexDirection: "column", gap: "0.2rem",
                      minWidth: 110,
                    }}>
                      <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(1rem,2vw,1.3rem)", fontWeight:800, color: stat.color }}>
                        {stat.value}
                      </span>
                      <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.7rem", color:"#6b7280", letterSpacing:"0.04em" }}>
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN — Profile card (desktop only) ── */}
          <div
            ref={profileRef}
            className="hidden lg:block w-72 xl:w-80 shrink-0"
            style={{ opacity: 0 }}
          >
            <ProfileCard
              userAvatar={userAvatar}
              userName={userName}
              userEmail={userEmail}
              statsLoading={statsLoading}
              totalComplaints={totalComplaints}
              successedComplaints={successedComplaints}
              navigate={navigate}
              handleLogout={handleLogout}
            />
          </div>
        </div>
      </div>
    </div>
  );
}