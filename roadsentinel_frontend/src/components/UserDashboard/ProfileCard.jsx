import Avatar from "./Avatar";
import StatRow from "./StatRow";
import { fmt, fmtRupee } from "./utils";

export default function ProfileCard({
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
}) {
  return (
    <div className="bg-[#05070a] border border-[rgba(120,120,130,0.18)] rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <Avatar src={userAvatar} name={userName} size={58} />
        <div className="min-w-0">
          <h3 className="font-display text-white truncate">{userName}</h3>
          <p className="font-grotesk text-sm text-gray-500 truncate">
            {userEmail || "No email on file"}
          </p>
        </div>
      </div>

      <div className="h-px bg-white/5 mb-3.5" />

      <div>
        <StatRow
          icon={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 1L8.6 5.2H13L9.5 7.8L10.8 12L7 9.4L3.2 12L4.5 7.8L1 5.2H5.4L7 1Z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </svg>
          }
          label="Earned Reward"
          value={walletLoading ? "…" : fmtRupee(walletAmount)}
          valueColor="#34d399"
        />
        <StatRow
          icon={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 1C4.2 1 2 3.2 2 6C2 9 7 13 7 13C7 13 12 9 12 6C12 3.2 9.8 1 7 1Z"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <circle cx="7" cy="6" r="1.8" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          }
          label="Registered Complaints"
          value={statsLoading ? "…" : fmt(totalComplaints)}
          valueColor="#f59e0b"
        />
        <StatRow
          icon={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
              <path
                d="M4.5 7L6 8.5L9.5 5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          label="Successed Complaints"
          value={statsLoading ? "…" : fmt(successedComplaints)}
          valueColor="#34d399"
        />
      </div>

      <div className="h-px bg-white/5 my-3.5" />

      <div className="flex flex-col gap-2">
        <button
          onClick={() => navigate("/complaints")}
          className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all hover:opacity-80 cursor-pointer bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.2)]"
        >
          <span className="font-display text-[#f59e0b] text-xs">View All Complaints</span>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path
              d="M2 6.5H11M11 6.5L7.5 3M11 6.5L7.5 10"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          onClick={() => navigate("/raiseChallanRequestOptions")}
          className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all hover:opacity-80 cursor-pointer bg-[rgba(99,102,241,0.08)] border border-[rgba(99,102,241,0.2)]"
        >
          <span className="font-display text-[#818cf8] text-xs">Raise New Complaint</span>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path
              d="M6.5 2V11M2 6.5H11"
              stroke="#818cf8"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all hover:opacity-80 cursor-pointer bg-[rgba(248,113,113,0.07)] border border-[rgba(248,113,113,0.18)]"
        >
          <span className="font-display text-[#f87171] text-xs">Logout</span>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path
              d="M5 2H2C1.4 2 1 2.4 1 3V10C1 10.6 1.4 11 2 11H5"
              stroke="#f87171"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M8.5 4.5L12 6.5M12 6.5L8.5 8.5M12 6.5H5"
              stroke="#f87171"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}