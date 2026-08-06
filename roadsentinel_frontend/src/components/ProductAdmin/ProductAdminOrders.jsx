import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Eye, 
  MoreVertical, 
  X, 
  ChevronDown, 
  Calendar, 
  DollarSign, 
  Package, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  RotateCcw, 
  RefreshCw 
} from "lucide-react";
import { adminOrderService } from "../../services/ProductAdmin/adminOrderService";

// List of all supported order statuses
const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "SHIPPED",
  "DELIVERED",
  "RETURNED",
  "REFUNDED"
];

// Status badge styling helper
const getStatusBadge = (status) => {
  switch (status?.toUpperCase()) {
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "CONFIRMED":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "SHIPPED":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "RETURNED":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "REFUNDED":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export default function ProductAdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Search Field Filter States
  const [searchField, setSearchField] = useState("orderId"); // "orderId" | "email" | "phone"
  const [searchTerm, setSearchTerm] = useState("");

  // Sorting / Filter States
  const [dateSort, setDateSort] = useState("NEWEST"); // "NEWEST" | "OLDEST"
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priceSort, setPriceSort] = useState("NONE"); // "NONE" | "LOW_TO_HIGH" | "HIGH_TO_LOW"

  // Action Modals & Popovers
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [activeMenuOrderId, setActiveMenuOrderId] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // InsetStyle matching the Product Management page
  const insetStyle = {
    backgroundColor: "#e6e7eb",
    boxShadow: "inset 6px 6px 12px #c7c9cc, inset -6px -6px 12px #ffffff",
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminOrderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle Order Status Update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await adminOrderService.updateOrderStatus(orderId, newStatus);
      setActiveMenuOrderId(null);
      
      // Update order status in local state smoothly
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Filter & Sort Logic
  const processedOrders = orders
    .filter((order) => {
      // 1. Search term match based on selected searchField
      const term = searchTerm.trim().toLowerCase();
      if (term) {
        if (searchField === "orderId") {
          if (!order.orderId?.toLowerCase().includes(term)) return false;
        } else if (searchField === "email") {
          if (!order.userEmail?.toLowerCase().includes(term)) return false;
        } else if (searchField === "phone") {
          if (!order.address?.phone?.toLowerCase().includes(term)) return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== "ALL" && order.status !== statusFilter) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // 3. Price Sorting
      if (priceSort === "LOW_TO_HIGH") {
        return a.totalAmount - b.totalAmount;
      }
      if (priceSort === "HIGH_TO_LOW") {
        return b.totalAmount - a.totalAmount;
      }

      // 4. Date Sorting
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateSort === "NEWEST" ? dateB - dateA : dateA - dateB;
    });

  // Calculate total items quantity in an order
  const getTotalItemsCount = (items = []) => {
    return items.reduce((acc, item) => acc + (item.quantity || 1), 0);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* TOP NAVBAR REPLICATING PRODUCT MANAGEMENT NAVBAR */}
      <div 
        className="rounded-2xl p-4 md:px-8 transition-all duration-300 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none w-full"
        style={insetStyle}
      >

        {/* CENTER CATEGORY / SORT DROPDOWNS */}
        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-gray-600 shrink-0">
          
          {/* Date Sorting */}
          <div className="relative flex items-center gap-1.5 cursor-pointer hover:text-black transition">
            <span>Date</span>
            <div className="relative flex items-center">
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
          </div>

          {/* Status Filter */}
          <div className="relative flex items-center gap-1.5 cursor-pointer hover:text-black transition">
            <span>Status</span>
            <div className="relative flex items-center">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer text-gray-800 font-bold pr-4 appearance-none"
              >
                <option value="ALL">All Orders</option>
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <ChevronDown className="h-3 w-3 text-gray-500 pointer-events-none absolute right-0" />
            </div>
          </div>

          {/* Price Sorting */}
          <div className="relative flex items-center gap-1.5 cursor-pointer hover:text-black transition">
            <span>Price</span>
            <div className="relative flex items-center">
              <select 
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer text-gray-800 font-bold pr-4 appearance-none"
              >
                <option value="NONE">Default</option>
                <option value="LOW_TO_HIGH">Low to High</option>
                <option value="HIGH_TO_LOW">High to Low</option>
              </select>
              <ChevronDown className="h-3 w-3 text-gray-500 pointer-events-none absolute right-0" />
            </div>
          </div>

        </div>

        {/* SEARCH BAR WITH EMBEDDED SEARCH TYPE SELECTOR */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <div className="relative flex items-center bg-white/80 border border-gray-200 rounded-xl px-2 py-1 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition">
            
            {/* Embedded Search Category Selector */}
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="bg-transparent text-[11px] font-bold text-gray-700 border-r border-gray-200 pr-2 mr-2 outline-none cursor-pointer"
            >
              <option value="orderId">Order ID</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>

            <Search className="h-3.5 w-3.5 text-gray-400 mr-1.5 shrink-0" />
            <input
              type="text"
              placeholder={`Search by ${searchField === 'orderId' ? 'ID' : searchField}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-xs w-28 sm:w-44 outline-none font-medium text-gray-800"
            />
          </div>
        </div>
      </div>

      {/* ORDERS TABLE CONTAINER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-gray-700 font-semibold animate-pulse">Loading Orders Directory...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-semibold">{error}</div>
        ) : processedOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No orders found matching your search or filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-3">Product</th>
                  <th className="py-3.5 px-3">Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3 text-center">Qty</th>
                  <th className="py-3.5 px-3">Price</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {processedOrders.map((order) => {
                  const firstItem = order.items?.[0];
                  const firstImage = firstItem?.images?.[0] || "https://via.placeholder.com/100";
                  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  });

                  return (
                    <tr key={order.orderId} className="hover:bg-gray-50/60 transition-colors">
                      
                      {/* Order ID */}
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                        #{order.orderId ? order.orderId.substring(0, 8) : "N/A"}
                      </td>

                      {/* Product Thumbnail */}
                      <td className="py-3 px-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center p-0.5">
                          <img 
                            src={firstImage} 
                            alt={firstItem?.productName || "Product"} 
                            className="object-contain h-full w-full"
                          />
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 font-medium text-gray-600 whitespace-nowrap">
                        {formattedDate}
                      </td>

                      {/* Customer Name */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900 line-clamp-1">
                          {order.userName || "Guest User"}
                        </div>
                        <div className="text-[10px] text-gray-400 line-clamp-1">
                          {order.userEmail || "No Email"}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(order.status)}`}>
                          • {order.status}
                        </span>
                      </td>

                      {/* Quantity */}
                      <td className="py-3 px-3 text-center font-bold text-gray-700">
                        {getTotalItemsCount(order.items)}
                      </td>

                      {/* Total Price */}
                      <td className="py-3 px-3 font-extrabold text-gray-900 whitespace-nowrap">
                        ₹{order.totalAmount}
                      </td>

                      {/* Actions Column */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2 relative">
                          
                          {/* View Order Details (Eye Icon) */}
                          <button
                            onClick={() => setSelectedOrderDetails(order)}
                            title="View Details"
                            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* Order Status Action Menu (Three Dots) */}
                          <div className="relative">
                            <button
                              onClick={() =>
                                setActiveMenuOrderId(
                                  activeMenuOrderId === order.orderId ? null : order.orderId
                                )
                              }
                              title="Update Status"
                              className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>

                            {/* Status Selection Popover */}
                            {activeMenuOrderId === order.orderId && (
                              <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-30 text-left animate-in fade-in zoom-in-95 duration-150">
                                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
                                  Change Status
                                </div>
                                {ORDER_STATUSES.map((statusOption) => (
                                  <button
                                    key={statusOption}
                                    disabled={updatingOrderId === order.orderId}
                                    onClick={() => handleStatusChange(order.orderId, statusOption)}
                                    className={`w-full px-3 py-1.5 text-xs text-left font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition flex items-center justify-between ${
                                      order.status === statusOption ? "text-indigo-600 font-bold bg-indigo-50/50" : "text-gray-700"
                                    }`}
                                  >
                                    <span>{statusOption}</span>
                                    {order.status === statusOption && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==================== COMPLETE ORDER DETAILS MODAL ==================== */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>Order Details</span>
                  <span className="text-sm font-mono text-indigo-600">#{selectedOrderDetails.orderId}</span>
                </h2>
                <p className="text-xs text-gray-400">
                  Placed on {new Date(selectedOrderDetails.createdAt).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrderDetails(null)} 
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 text-xs">
              
              {/* Customer & Address Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Customer Information */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                  <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <User className="h-4 w-4 text-indigo-600" />
                    <span>Customer Information</span>
                  </h3>
                  <div className="space-y-1 text-gray-600">
                    <p><span className="font-semibold text-gray-800">Name:</span> {selectedOrderDetails.userName || "N/A"}</p>
                    <p><span className="font-semibold text-gray-800">Email:</span> {selectedOrderDetails.userEmail || "N/A"}</p>
                    <p><span className="font-semibold text-gray-800">Phone:</span> {selectedOrderDetails.address?.phone || "N/A"}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                  <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-600" />
                    <span>Shipping Address</span>
                  </h3>
                  <div className="text-gray-600 leading-relaxed">
                    <p>{selectedOrderDetails.address?.houseNo}, {selectedOrderDetails.address?.street}</p>
                    <p>{selectedOrderDetails.address?.locality} {selectedOrderDetails.address?.landmark && `(Near ${selectedOrderDetails.address.landmark})`}</p>
                    <p>{selectedOrderDetails.address?.city}, {selectedOrderDetails.address?.state} - {selectedOrderDetails.address?.pincode}</p>
                    <p className="font-semibold text-gray-800 mt-1">{selectedOrderDetails.address?.country}</p>
                  </div>
                </div>

              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <Package className="h-4 w-4 text-indigo-600" />
                  <span>Purchased Items ({selectedOrderDetails.items?.length || 0})</span>
                </h3>

                <div className="space-y-3">
                  {selectedOrderDetails.items?.map((item, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-2xl p-3 flex flex-col sm:flex-row gap-4 items-center bg-white shadow-sm">
                      
                      {/* Product Gallery Images */}
                      <div className="flex gap-1.5 overflow-x-auto shrink-0 max-w-full sm:max-w-xs">
                        {item.images?.map((img, imgIdx) => (
                          <img
                            key={imgIdx}
                            src={img}
                            alt="product view"
                            className="w-14 h-14 object-contain bg-gray-50 rounded-lg border border-gray-100 p-1 shrink-0"
                          />
                        ))}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 space-y-1 w-full text-center sm:text-left">
                        <h4 className="font-bold text-gray-900 text-sm">{item.productName}</h4>
                        <div className="flex items-center justify-center sm:justify-start gap-3 text-gray-500">
                          <span>Size: <strong className="text-gray-800">{item.size || "N/A"}</strong></span>
                          <span>Quantity: <strong className="text-gray-800">{item.quantity}</strong></span>
                          <span>Unit Price: <strong className="text-gray-800">₹{item.price}</strong></span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary Footer */}
              <div className="border-t pt-4 flex items-center justify-between">
                <div>
                  <span className="text-gray-500 mr-2">Current Status:</span>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(selectedOrderDetails.status)}`}>
                    • {selectedOrderDetails.status}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-gray-500 font-semibold block text-[11px]">Total Amount</span>
                  <span className="text-xl font-extrabold text-gray-900">₹{selectedOrderDetails.totalAmount}</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}