import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  User,
  MapPin,
  ShieldAlert,
  CheckCircle2,
  Award,
  ZoomIn,
  X,
  Loader2,
} from "lucide-react";
import { officerService } from "../../services/Officer/officerService";

const COMPLAINT_STATUSES = ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"];

// Custom Color Mapping
const getStatusBadgeStyle = (status) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return { backgroundColor: "#FEF3C7", color: "#92400E" };
    case "UNDER_REVIEW":
      return { backgroundColor: "#DBEAFE", color: "#1D4ED8" };
    case "APPROVED":
      return { backgroundColor: "#DCFCE7", color: "#166534" };
    case "REJECTED":
      return { backgroundColor: "#FEE2E2", color: "#B91C1C" };
    default:
      return { backgroundColor: "#f3f4f6", color: "#374151" };
  }
};

// Vehicle Reward Rules
const calculateRewardByVehicle = (vType) => {
  const type = vType?.toLowerCase() || "";
  if (type.includes("bike") || type.includes("two") || type.includes("2"))
    return 15;
  if (type.includes("car") || type.includes("four") || type.includes("4"))
    return 30;
  if (
    type.includes("auto") ||
    type.includes("three") ||
    type.includes("3") ||
    type.includes("rikshaw")
  )
    return 25;
  if (
    type.includes("commercial") ||
    type.includes("truck") ||
    type.includes("bus")
  )
    return 50;
  return 20;
};

export default function OfficerComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [dateSort, setDateSort] = useState("NEWEST");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("vehicleNumber");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // View Details Mode State
  const [activeReviewComplaint, setActiveReviewComplaint] = useState(null);
  const [complainantUser, setComplainantUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  const insetStyle = {
    backgroundColor: "#e6e7eb",
    boxShadow: "inset 6px 6px 12px #c7c9cc, inset -6px -6px 12px #ffffff",
  };

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await officerService.getAllComplaints();
      setComplaints(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, searchField, statusFilter, dateSort]);

  // Open Detailed Review and fetch associated user details from backend
  const handleOpenReview = async (complaint) => {
    setActiveReviewComplaint(complaint);
    setComplainantUser(null);
    setLoadingUser(true);

    try {
      const userData = await officerService.getUserByComplaintId(complaint.id);
      setComplainantUser(userData);
    } catch (err) {
      console.error("Failed to load user info:", err);
    } finally {
      setLoadingUser(false);
    }
  };

  // Handle Status Update with reward calculation
  // Handle Status Update with reward calculation
  const handleStatusChange = async (complaint, newStatus) => {
    try {
      setUpdatingStatus(true);

      // 1. Always update the complaint status first
      await officerService.updateComplaintStatus(complaint.id, newStatus);

      let assignedReward = null;

      // 2. If status is APPROVED, invoke your dedicated reward API!
      if (newStatus === "APPROVED") {
        assignedReward = calculateRewardByVehicle(complaint.vehicleType);
        await officerService.assignReward(complaint.id, assignedReward);
      }

      // 3. Update local UI states
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === complaint.id
            ? {
                ...c,
                status: newStatus,
                rewardAmount: assignedReward ?? c.rewardAmount,
              }
            : c,
        ),
      );

      if (activeReviewComplaint && activeReviewComplaint.id === complaint.id) {
        setActiveReviewComplaint((prev) => ({
          ...prev,
          status: newStatus,
          rewardAmount: assignedReward ?? prev.rewardAmount,
        }));
      }

      alert(
        `Status updated to ${newStatus}${assignedReward ? ` with ₹${assignedReward} reward assigned!` : ""}`,
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Filter & Sort
  const filteredComplaints = complaints
    .filter((c) => {
      const term = searchTerm.trim().toLowerCase();
      if (term) {
        if (searchField === "vehicleNumber") {
          if (!c.vehicleNumber?.toLowerCase().includes(term)) return false;
        } else if (searchField === "city") {
          if (!c.city?.toLowerCase().includes(term)) return false;
        } else if (searchField === "violationType") {
          if (!c.violationType?.toLowerCase().includes(term)) return false;
        }
      }
      if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.raisedAt).getTime();
      const dateB = new Date(b.raisedAt).getTime();
      return dateSort === "NEWEST" ? dateB - dateA : dateA - dateB;
    });

  // Pagination Logic
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedComplaints = filteredComplaints.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // =========================================================================
  // VIEW MODE 2: DETAILED COMPLAINT REVIEW VIEW
  // =========================================================================
  if (activeReviewComplaint) {
    const calculatedReward = calculateRewardByVehicle(
      activeReviewComplaint.vehicleType,
    );

    return (
      <div className="w-full max-w-6xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div
          className="rounded-2xl p-4 transition-all duration-300 flex items-center justify-between gap-4"
          style={insetStyle}
        >
          <button
            onClick={() => setActiveReviewComplaint(null)}
            className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-700 hover:text-black transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Complaints Directory</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500">Status:</span>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold border border-black/5"
              style={getStatusBadgeStyle(activeReviewComplaint.status)}
            >
              • {activeReviewComplaint.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Complaint Details & Media */}
          <div className="lg:col-span-2 space-y-6">
            {/* Record Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-black" />
                  <span>Violation Incident Record</span>
                </h2>
                <span className="text-xs font-mono text-gray-400">
                  ID:{" "}
                  {activeReviewComplaint.id ? activeReviewComplaint.id : "N/A"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block font-semibold">
                    Vehicle Number
                  </span>
                  <span className="text-base font-extrabold text-gray-900 font-mono">
                    {activeReviewComplaint.vehicleNumber}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold">
                    Vehicle Type
                  </span>
                  <span className="text-sm font-bold text-gray-800 capitalize">
                    {activeReviewComplaint.vehicleType}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold">
                    Violation Type
                  </span>
                  <span className="text-sm font-bold text-rose-700">
                    {activeReviewComplaint.violationType}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold">
                    Reported Date
                  </span>
                  <span className="text-xs font-medium text-gray-700">
                    {new Date(activeReviewComplaint.raisedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block font-semibold text-xs mb-1">
                  Description
                </span>
                <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed">
                  {activeReviewComplaint.description ||
                    "No description provided."}
                </p>
              </div>

              <div>
                <span className="text-gray-400 block font-semibold text-xs mb-1">
                  Location Details
                </span>
                <p className="text-xs text-gray-700 flex items-start gap-1">
                  <MapPin className="h-4 w-4 text-green-700 shrink-0 mt-0.5" />
                  <span>
                    {activeReviewComplaint.address},{" "}
                    {activeReviewComplaint.city}, {activeReviewComplaint.state}
                  </span>
                </p>
              </div>
            </div>

            {/* Evidence Attachments */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">
                Evidence Attachments (
                {activeReviewComplaint.attachments?.length || 0})
              </h3>

              {activeReviewComplaint.attachments?.length === 0 ? (
                <p className="text-xs text-gray-400 italic">
                  No media attachments uploaded.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {activeReviewComplaint.attachments?.map((att) => (
                    <div
                      key={att.id}
                      onClick={() => setZoomedImage(att.imageUrl)}
                      className="relative h-32 rounded-2xl overflow-hidden border border-gray-200 group cursor-pointer bg-gray-50"
                    >
                      <img
                        src={att.imageUrl}
                        alt="Evidence"
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold gap-1">
                        <ZoomIn className="h-4 w-4" /> View
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: User Details & Actions */}
          <div className="space-y-6">
            {/* COMPLAINANT USER DETAILS (FETCHED VIA NEW API) */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b pb-3">
                <User className="h-4 w-4 text-black" />
                <span>Complainant Information</span>
              </h3>

              {loadingUser ? (
                <div className="py-6 flex items-center justify-center text-gray-400 text-xs gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                  <span>Fetching user profile...</span>
                </div>
              ) : complainantUser ? (
                <div className="space-y-2.5 text-xs text-gray-600">
                  <div>
                    <span className="font-semibold text-gray-400 block text-[10px]">
                      User ID
                    </span>
                    <span className="font-mono text-xs font-bold text-blue-600 break-all">
                      {complainantUser.id}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-400 block text-[10px]">
                      Name
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {complainantUser.name || "Anonymous User"}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-400 block text-[10px]">
                      Email ID
                    </span>
                    <span className="text-xs font-semibold text-gray-800">
                      {complainantUser.email || "N/A"}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  User profile details unavailable.
                </p>
              )}
            </div>

            {/* Officer Action Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-b pb-3">
                Officer Review Actions
              </h3>

              <div className="space-y-2">
                <label
                  htmlFor="decisionStatusSelect"
                  className="text-xs font-semibold text-gray-600"
                >
                  Update Decision Status:
                </label>
                <select
                  id="decisionStatusSelect"
                  disabled={
                    updatingStatus ||
                    activeReviewComplaint.status === "APPROVED"
                  }
                  value={activeReviewComplaint.status}
                  onChange={(e) =>
                    handleStatusChange(activeReviewComplaint, e.target.value)
                  }
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-60 cursor-pointer"
                >
                  {COMPLAINT_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reward Box */}
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-xs text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <Award className="h-4 w-4 text-emerald-600" />
                  <span>Calculated Reward Rate</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Approving a report for vehicle type{" "}
                  <strong>
                    {activeReviewComplaint.vehicleType || "Standard"}
                  </strong>{" "}
                  auto-issues
                  <strong className="text-emerald-900 text-sm block mt-1">
                    ₹{calculatedReward} Reward Amount
                  </strong>
                </p>
              </div>

              {activeReviewComplaint.status === "APPROVED" && (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Verification complete.
                  Report approved.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* IMAGE ZOOM MODAL */}
        {zoomedImage && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
              <button
                onClick={() => setZoomedImage(null)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 p-2 cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={zoomedImage}
                alt="Enlarged evidence"
                className="max-w-full max-h-[85vh] object-contain rounded-2xl"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE 1: COMPLAINTS TABLE DIRECTORY
  // =========================================================================
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* NAVBAR */}
      <div
        className="rounded-2xl p-4 md:px-8 transition-all duration-300 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none w-full"
        style={insetStyle}
      >
        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-gray-600 shrink-0">
          <div className="relative flex items-center gap-1.5 cursor-pointer hover:text-black">
            <span>Date</span>
            <select
              value={dateSort}
              onChange={(e) => setDateSort(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer text-gray-800 font-bold pr-4 appearance-none"
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
            </select>
            <ChevronDown className="h-3 w-3 text-gray-500 pointer-events-none absolute right-0" />
          </div>

          <div className="relative flex items-center gap-1.5 cursor-pointer hover:text-black">
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer text-gray-800 font-bold pr-4 appearance-none"
            >
              <option value="ALL">All Statuses</option>
              {COMPLAINT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="h-3 w-3 text-gray-500 pointer-events-none absolute right-0" />
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <div className="relative flex items-center bg-white/80 border border-gray-200 rounded-xl px-2 py-1 shadow-sm">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="bg-transparent text-[11px] font-bold text-gray-700 border-r border-gray-200 pr-2 mr-2 outline-none cursor-pointer"
            >
              <option value="vehicleNumber">Vehicle No</option>
              <option value="city">City</option>
              <option value="violationType">Violation</option>
            </select>

            <Search className="h-3.5 w-3.5 text-gray-400 mr-1.5 shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-xs w-28 sm:w-44 outline-none font-medium text-gray-800"
            />
          </div>
        </div>
      </div>

      {/* TABLE DIRECTORY */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-gray-700 font-semibold animate-pulse">
            Loading Complaints Directory...
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-semibold">
            {error}
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No complaints found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Vehicle Number</th>
                    <th className="py-3.5 px-3">Photo</th>
                    <th className="py-3.5 px-3">Violation</th>
                    <th className="py-3.5 px-3">City</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-3">Reward</th>
                    <th className="py-3.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {displayedComplaints.map((complaint) => {
                    const firstImg =
                      complaint.attachments?.[0]?.imageUrl ||
                      "https://via.placeholder.com/100";
                    const isApproved = complaint.status === "APPROVED";

                    return (
                      <tr
                        key={complaint.id}
                        className="hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="py-3 px-4 font-bold text-black">
                          {complaint.vehicleNumber}
                        </td>
                        <td className="py-3 px-3">
                          <img
                            src={firstImg}
                            alt="Vehicle"
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 border"
                          />
                        </td>
                        <td className="py-3 px-3 font-medium text-gray-700">
                          {complaint.violationType}
                        </td>
                        <td className="py-3 px-3 text-gray-600">
                          {complaint.city}
                        </td>

                        {/* CUSTOM STATUS COLORS */}
                        <td className="py-3 px-3">
                          <span
                            className="px-2.5 py-1 rounded-full text-[10px] font-bold border border-black/5"
                            style={getStatusBadgeStyle(complaint.status)}
                          >
                            • {complaint.status}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-extrabold text-emerald-600">
                          {complaint.rewardAmount
                            ? `₹${complaint.rewardAmount}`
                            : "N/A"}
                        </td>

                        {/* ACTIONS COLUMN */}
                        <td className="py-3 px-4 text-center">
                          {isApproved ? (
                            <span className="text-xs font-extrabold text-[#166534] bg-[#DCFCE7] px-2.5 py-1 rounded-lg border border-emerald-200">
                              Completed
                            </span>
                          ) : (
                            <button
                              onClick={() => handleOpenReview(complaint)}
                              title="Review Complaint"
                              className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 text-xs font-semibold text-gray-600 bg-gray-50/50">
                <div>
                  Showing{" "}
                  <span className="font-bold text-gray-900">
                    {indexOfFirstItem + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold text-gray-900">
                    {Math.min(indexOfLastItem, filteredComplaints.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-gray-900">
                    {filteredComplaints.length}
                  </span>{" "}
                  complaints
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border rounded-xl hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-sm ${
                          currentPage === pageNum
                            ? "bg-black text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100 border-gray-200"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border rounded-xl hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
