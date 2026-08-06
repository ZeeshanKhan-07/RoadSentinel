import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import useAuth from "../../auth/store";
import {
  getTotalComplaints,
  getSuccessedComplaints,
} from "../../services/userService";
import { getUserBalance } from "../../services/walletService";

import QuoteBanner from "../../components/UserDashboard/QuoteBanner";
import ProfileCard from "../../components/UserDashboard/ProfileCard";
import Tile from "../../components/UserDashboard/Tile";
import { fmt, fmtRupee } from "../../components/UserDashboard/utils";

export default function Dashboard() {
  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);
  const user = useAuth((state) => state.user);

  const userId = user?.id;
  const userName = user?.name || user?.fullName || user?.username || "User";
  const userEmail = user?.email || "";
  const userAvatar =
    user?.profileImage || user?.avatar || user?.profilePic || null;

  const wrapperRef = useRef(null);
  const bannerRef = useRef(null);
  const profileRef = useRef(null);
  const tilesRef = useRef([]);
  const statsRef = useRef(null);

  const [totalComplaints, setTotalComplaints] = useState(null);
  const [successedComplaints, setSuccessedComplaints] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [walletAmount, setWalletAmount] = useState(null);
  const [walletLoading, setWalletLoading] = useState(true);

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

      setWalletLoading(true);
      const w = await getUserBalance();
      setWalletAmount(w);
      setWalletLoading(false);
    })();
  }, [userId]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        bannerRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      );
      if (profileRef.current) {
        tl.fromTo(
          profileRef.current,
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
      tl.fromTo(
        statsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45 },
        "-=0.25"
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const handleLogout = () => {
    toast.success("Successfully logged out!");
    logout();
    navigate("/");
  };

  const TILES = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 2L12.4 7.5H18L13.5 11L15.3 17L10 13.5L4.7 17L6.5 11L2 7.5H7.6L10 2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      ),
      label: "Earned Reward",
      sub: walletLoading ? "…" : fmtRupee(walletAmount),
      accent: "#34d399",
      onClick: () => {},
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect
            x="2"
            y="3"
            width="16"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M6 7H14M6 10H11M6 13H9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
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
          <path
            d="M10 2C6.13 2 3 5.13 3 9C3 13 10 19 10 19C10 19 17 13 17 9C17 5.13 13.87 2 10 2Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <circle
            cx="10"
            cy="9"
            r="2.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
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
          <circle
            cx="10"
            cy="10"
            r="7"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M7 10L9 12L13 8"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      label: "Accuracy",
      sub: "Coming Soon",
      accent: "#a78bfa",
      onClick: () => toast("Accuracy feature coming soon!", { icon: "🚀" }),
    },
  ];

  const profileCardProps = {
    userAvatar,
    userName,
    userEmail,
    statsLoading,
    totalComplaints,
    successedComplaints,
    walletAmount,
    walletLoading,
    navigate,
    handleLogout,
  };

  const activityStats = [
    {
      label: "Total Registered",
      value: statsLoading ? "…" : fmt(totalComplaints),
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.25)",
    },
    {
      label: "Successed",
      value: statsLoading ? "…" : fmt(successedComplaints),
      color: "#34d399",
      bg: "rgba(52,211,153,0.1)",
      border: "rgba(52,211,153,0.25)",
    },
    {
      label: "Earned Reward",
      value: walletLoading ? "…" : fmtRupee(walletAmount),
      color: "#34d399",
      bg: "rgba(52,211,153,0.07)",
      border: "rgba(52,211,153,0.18)",
    },
  ];

  return (
    <div
      ref={wrapperRef}
      className="min-h-screen w-full relative bg-[#080808] font-sans"
    >
      {/* Spacer to push content below fixed header */}
      <div className="h-20 w-full clear-both" />

      {/* Main Container */}
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-6 lg:pb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-5 flex-1 min-w-0">
            {/* Quote Banner */}
            <div ref={bannerRef} className="opacity-0">
              <QuoteBanner name={userName} />
            </div>

            {/* Profile Card (Mobile Only) */}
            <div className="block lg:hidden">
              <ProfileCard {...profileCardProps} />
            </div>

            {/* Quick Action Tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {TILES.map((tile, i) => (
                <Tile
                  key={tile.label}
                  {...tile}
                  tileRef={(el) => (tilesRef.current[i] = el)}
                />
              ))}
            </div>

            {/* Recent Activity Section */}
            <div ref={statsRef} className="opacity-0">
              <div className="bg-white/[0.025] border border-[rgba(120,120,130,0.18)] rounded-[14px] p-[clamp(1rem,2.5vw,1.4rem)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-white uppercase">
                    Recent Activity
                  </span>
                  <button
                    onClick={() => navigate("/complaints")}
                    className="font-grotesk text-gray-500 text-xs flex items-center gap-1 cursor-pointer hover:text-white transition-colors"
                  >
                    View All
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6H10M10 6L7 3M10 6L7 9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {activityStats.map((stat) => (
                    <div
                      key={stat.label}
                      style={{
                        backgroundColor: stat.bg,
                        borderColor: stat.border,
                      }}
                      className="border rounded-xl p-[0.6rem_1rem] flex flex-col gap-1 min-w-[110px]"
                    >
                      <span
                        style={{ color: stat.color }}
                        className="font-sans text-[clamp(1rem,2vw,1.3rem)] font-extrabold"
                      >
                        {stat.value}
                      </span>
                      <span className="font-grotesk text-gray-500 text-xs">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Desktop Only) */}
          <div
            ref={profileRef}
            className="hidden lg:block w-72 xl:w-80 shrink-0 opacity-0"
          >
            <ProfileCard {...profileCardProps} />
          </div>
        </div>
      </div>
    </div>
  );
}