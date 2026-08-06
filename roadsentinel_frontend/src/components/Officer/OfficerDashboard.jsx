import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { 
  FileText, 
  Clock, 
  Calendar, 
  Award, 
  AlertCircle, 
  Search, 
  CheckCircle, 
  XCircle, 
  Eye, 
  MapPin, 
  Shield 
} from "lucide-react";
import { officerService } from "../../services/Officer/officerService";
import OfficerProfile from "./OfficerProfile";

const STATUS_COLOR_MAP = {
  PENDING: "#f59e0b",
  UNDERREVIEW: "#3b82f6",
  APPROVED: "#10b981",
  REJECTED: "#ef4444",
};

const FALLBACK_COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"];

export default function OfficerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await officerService.getDashboardSummary();
        setData(res);
      } catch (err) {
        setError(err.message || "Failed to load officer dashboard summary.");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        const cards = document.querySelectorAll(".animate-card");
        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" }
          );
        }
      });
      return () => ctx.revert();
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-700 text-xl font-semibold animate-pulse min-h-[400px]">
        Loading Officer Analytics Portfolio...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-red-500 p-4 min-h-[400px]">
        <p className="text-lg font-bold mb-4 text-center">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-white text-gray-800 rounded shadow hover:bg-gray-100 transition"
        >
          Retry Request
        </button>
      </div>
    );
  }

  // Map Donut chart segments
  const chartPieData = [
    { name: "PENDING", value: data?.statusDistribution?.pendingPercentage || 0, color: STATUS_COLOR_MAP.PENDING },
    { name: "UNDER_REVIEW", value: data?.statusDistribution?.underReviewPercentage || 0, color: STATUS_COLOR_MAP.UNDERREVIEW },
    { name: "APPROVED", value: data?.statusDistribution?.approvedPercentage || 0, color: STATUS_COLOR_MAP.APPROVED },
    { name: "REJECTED", value: data?.statusDistribution?.rejectedPercentage || 0, color: STATUS_COLOR_MAP.REJECTED },
  ].filter((item) => item.value > 0);

  const centerDisplayTitle = hoveredSegment ? hoveredSegment.name : "Status";
  const centerDisplayValue = hoveredSegment ? `${hoveredSegment.value}%` : `${data?.totalComplaints || 0}`;

  const insetStyle = {
    backgroundColor: "#e6e7eb",
    boxShadow: "inset 6px 6px 12px #c7c9cc, inset -6px -6px 12px #ffffff",
  };

  const cardStyle = {
    backgroundColor: "#e6e7eb",
    boxShadow: "8px 8px 16px #c7c9cc, -8px -8px 16px #ffffff",
  };

  const barColors = ["#1e293b", "#475569", "#64748b", "#94a3b8", "#cbd5e1"];

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      
      {/* ROW 1: OFFICER PROFILE & DOUGHNUT STATUS DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 w-full">
          <OfficerProfile />
        </div>

        <div
          style={cardStyle}
          className="animate-card lg:col-span-7 bg-white rounded-3xl p-6 shadow-lg flex flex-col justify-between w-full"
        >
          <h3 className="text-lg font-bold text-black mb-4 text-left">
            Complaints Distribution
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 h-full">
            
            {/* DONUT CHART */}
            <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartPieData.length > 0 ? chartPieData : [{ name: "EMPTY", value: 1, color: "#e5e7eb" }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={68}
                    paddingAngle={chartPieData.length > 1 ? 4 : 0}
                    dataKey="value"
                    stroke="none"
                    onMouseEnter={(data) => {
                      if (data && data.name !== "EMPTY") {
                        setHoveredSegment({ name: data.name, value: data.value });
                      }
                    }}
                    onMouseLeave={() => setHoveredSegment(null)}
                  >
                    {chartPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute text-center pointer-events-none flex flex-col items-center justify-center">
                <span className="block text-2xl font-bold text-gray-900 truncate">
                  {centerDisplayValue}
                </span>
                <span className="text-xs font-semibold text-gray-500 capitalize truncate max-w-[85px]">
                  {centerDisplayTitle.toLowerCase()}
                </span>
              </div>
            </div>

            {/* STATUS SUMMARY PILLS */}
            <div className="flex-1 w-full space-y-2 max-w-sm">
              {[
                { status: "Pending", count: data?.statusCounts?.pending || 0, color: STATUS_COLOR_MAP.PENDING },
                { status: "Under Review", count: data?.statusCounts?.underReview || 0, color: STATUS_COLOR_MAP.UNDERREVIEW },
                { status: "Approved", count: data?.statusCounts?.approved || 0, color: STATUS_COLOR_MAP.APPROVED },
                { status: "Rejected", count: data?.statusCounts?.rejected || 0, color: STATUS_COLOR_MAP.REJECTED },
              ].map((item, idx) => {
                const isHovered = hoveredSegment?.name?.toUpperCase() === item.status.replace(" ", "_").toUpperCase();
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredSegment({ name: item.status, value: item.count })}
                    onMouseLeave={() => setHoveredSegment(null)}
                    style={!isHovered ? insetStyle : {}}
                    className={`flex items-center justify-between rounded-xl p-3 text-xs transition-all duration-200 cursor-pointer ${
                      isHovered ? "bg-white border border-gray-200 shadow-md scale-[1.02]" : "border border-transparent"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: item.color }}></span>
                      <span className="font-semibold text-gray-800 uppercase tracking-wider">{item.status}</span>
                    </div>
                    <span className="font-bold text-gray-900 text-sm">{String(item.count).padStart(2, "0")}</span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* ROW 2: 8 SMALL METRIC CARDS (2 Rows of 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Complaints", value: data?.totalComplaints || 0, icon: FileText },
          { title: "Today's Complaints", value: data?.todayComplaints || 0, icon: Clock },
          { title: "This Month", value: data?.thisMonthComplaints || 0, icon: Calendar },
          { title: "Rewards Issued", value: `₹${data?.totalRewardsIssued?.toLocaleString() || 0}`, icon: Award },
          { title: "Pending", value: data?.statusCounts?.pending || 0, icon: AlertCircle },
          { title: "Under Review", value: data?.statusCounts?.underReview || 0, icon: Search },
          { title: "Approved", value: data?.statusCounts?.approved || 0, icon: CheckCircle },
          { title: "Rejected", value: data?.statusCounts?.rejected || 0, icon: XCircle },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              style={cardStyle}
              className="animate-card bg-white rounded-xl p-4 shadow flex items-center space-x-4 border border-gray-100 w-full"
            >
              <div className="p-3 bg-white rounded-xl text-black shrink-0 shadow-sm">
                <Icon className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm font-semibold text-gray-500 truncate">{card.title}</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 truncate">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ROW 3: RECENT COMPLAINTS DIRECTORY TABLE */}
      <div style={cardStyle} className="animate-card bg-white rounded-3xl p-6 shadow-xl w-full">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Complaints Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-3">Vehicle / Photo</th>
                <th className="py-3 px-3">Violation</th>
                <th className="py-3 px-3">City</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Reward</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {data?.recentComplaints?.map((complaint) => {
                const attachmentImg = complaint.attachments?.[0]?.imageUrl || "https://via.placeholder.com/100";
                return (
                  <tr key={complaint.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img src={attachmentImg} alt="Vehicle" className="w-10 h-10 rounded-lg object-cover bg-gray-100 border" />
                        <div>
                          <p className="font-bold text-gray-900">{complaint.vehicleNumber}</p>
                          <p className="text-[10px] text-gray-400 capitalize">{complaint.vehicleType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-gray-700">{complaint.violationType}</td>
                    <td className="py-3 px-3 text-gray-600">{complaint.city}</td>
                    <td className="py-3 px-3 text-gray-500">{new Date(complaint.raisedAt).toLocaleDateString()}</td>
                    <td className="py-3 px-3 font-bold text-emerald-600">
                      {complaint.rewardAmount ? `₹${complaint.rewardAmount}` : "N/A"}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 border text-gray-800">
                        • {complaint.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setSelectedComplaint(complaint)}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROW 4: COMPLAINTS BY CITY BAR CHART */}
      <div style={cardStyle} className="animate-card bg-white rounded-3xl p-6 shadow-xl w-full">
        <div className="mb-4">
          <h3 className="text-lg md:text-xl font-bold text-gray-800">Complaints Volume by City</h3>
          <p className="text-xs text-gray-400">Hover bars to reveal geographical breakdown and exact incident counts.</p>
        </div>

        <div className="w-full h-64 md:h-80 overflow-x-auto overflow-y-hidden">
          <div className="min-w-[500px] h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.complaintsByCity || []} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="city" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const { city, count } = payload[0].payload;
                      return (
                        <div className="bg-white text-black p-3 rounded-xl shadow-xl text-xs space-y-1 z-50">
                          <p className="font-bold text-black">{city}</p>
                          <p className="font-semibold">Complaints Count: <span className="text-emerald-600">{count}</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[15, 15, 0, 0]} maxBarSize={45}>
                  {(data?.complaintsByCity || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* READ-ONLY DETAIL MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-lg">Complaint Details</h3>
              <button onClick={() => setSelectedComplaint(null)} className="p-1 text-gray-400 hover:text-gray-600 rounded-full">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p><strong>Vehicle Number:</strong> {selectedComplaint.vehicleNumber}</p>
              <p><strong>Violation Type:</strong> {selectedComplaint.violationType}</p>
              <p><strong>Location:</strong> {selectedComplaint.address}, {selectedComplaint.city}</p>
              <p><strong>Description:</strong> {selectedComplaint.description}</p>
              
              <div>
                <strong className="block mb-2">Evidence Attachments:</strong>
                <div className="flex gap-2 overflow-x-auto">
                  {selectedComplaint.attachments?.map((att) => (
                    <img key={att.id} src={att.imageUrl} alt="evidence" className="w-20 h-20 object-cover rounded-xl border" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}