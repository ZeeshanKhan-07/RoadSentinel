import React, { useState } from "react";
import { Search, Plus, ChevronDown, Filter, X } from "lucide-react";

export default function TopProductsNavbar({
  searchTerm,
  setSearchTerm,
  priceFilter,
  setPriceFilter,
  vehicleFilter,
  setVehicleFilter,
  quantityFilter,
  setQuantityFilter,
  setIsAddModalOpen,
  insetStyle
}) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <>
      {/* TOP SINGLE-ROW NAVBAR */}
      <div 
        className="rounded-2xl p-3 md:px-6 transition-all duration-300 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none w-full"
        style={insetStyle}
      >
        {/* BRAND / PAGE TITLE */}
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight whitespace-nowrap shrink-0">
          Manage Products
        </h1>

        {/* DESKTOP CATEGORY DROPDOWNS (Hidden on small screens) */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          
          {/* Price Filter Pill */}
          <div className="relative flex items-center bg-white/70 hover:bg-white border border-gray-200/80 rounded-xl px-3 py-1.5 shadow-sm transition">
            <label htmlFor="priceFilter" className="text-xs font-semibold text-gray-500 mr-1.5 whitespace-nowrap">Price:</label>
            <select 
              id="priceFilter"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-800 outline-none cursor-pointer pr-4 appearance-none"
            >
              <option value="ALL">All Prices</option>
              <option value="LOW">&lt; $1500</option>
              <option value="HIGH">&ge; $1500</option>
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 pointer-events-none absolute right-2" />
          </div>

          {/* Vehicle Category Filter Pill */}
          <div className="relative flex items-center bg-white/70 hover:bg-white border border-gray-200/80 rounded-xl px-3 py-1.5 shadow-sm transition">
            <label htmlFor="vehicleFilter" className="text-xs font-semibold text-gray-500 mr-1.5 whitespace-nowrap">Vehicle:</label>
            <select 
              id="vehicleFilter"
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-800 outline-none cursor-pointer pr-4 appearance-none"
            >
              <option value="ALL">All Vehicles</option>
              <option value="TWO_WHEELERS">2-Wheelers</option>
              <option value="FOUR_WHEELERS">4-Wheelers</option>
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 pointer-events-none absolute right-2" />
          </div>

          {/* Quantity Filter Pill */}
          <div className="relative flex items-center bg-white/70 hover:bg-white border border-gray-200/80 rounded-xl px-3 py-1.5 shadow-sm transition">
            <label htmlFor="quantityFilter" className="text-xs font-semibold text-gray-500 mr-1.5 whitespace-nowrap">Stock:</label>
            <select 
              id="quantityFilter"
              value={quantityFilter}
              onChange={(e) => setQuantityFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-800 outline-none cursor-pointer pr-4 appearance-none"
            >
              <option value="ALL">All Stock</option>
              <option value="IN_STOCK">In Stock (&ge; 50)</option>
              <option value="LOW_STOCK">Low Stock (&lt; 50)</option>
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 pointer-events-none absolute right-2" />
          </div>

        </div>

        {/* SEARCH & ACTIONS CONTAINER */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-auto">
          
          {/* SEARCH BAR */}
          <div className="relative w-36 sm:w-48 lg:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white/90 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
            />
          </div>

          {/* MOBILE FILTER TRIGGER BUTTON (Visible only on mobile) */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden p-2 bg-white border border-gray-200 text-gray-700 hover:text-indigo-600 rounded-xl shadow-sm transition flex items-center justify-center shrink-0"
            title="Filter Options"
          >
            <Filter className="h-4 w-4" />
          </button>

          {/* ADD PRODUCT BUTTON */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 md:px-4 py-1.5 md:py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition whitespace-nowrap shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Products</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

      </div>

      {/* MOBILE FILTER MODAL SHEET */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 md:hidden">
          <div className="bg-white w-full sm:max-w-xs rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
            
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Filter className="h-4 w-4 text-indigo-600" />
                <span>Filter Products</span>
              </h3>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Price Selector */}
            <div className="space-y-1">
              <label htmlFor="mobilePriceFilter" className="text-xs font-semibold text-gray-600">Price Range</label>
              <select
                id="mobilePriceFilter"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none"
              >
                <option value="ALL">All Prices</option>
                <option value="LOW">&lt; $1500</option>
                <option value="HIGH">&ge; $1500</option>
              </select>
            </div>

            {/* Vehicle Category Selector */}
            <div className="space-y-1">
              <label htmlFor="mobileVehicleFilter" className="text-xs font-semibold text-gray-600">Vehicle Category</label>
              <select
                id="mobileVehicleFilter"
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none"
              >
                <option value="ALL">All Vehicles</option>
                <option value="TWO_WHEELERS">Two Wheelers</option>
                <option value="FOUR_WHEELERS">Four Wheelers</option>
              </select>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-1">
              <label htmlFor="mobileQuantityFilter" className="text-xs font-semibold text-gray-600">Stock Status</label>
              <select
                id="mobileQuantityFilter"
                value={quantityFilter}
                onChange={(e) => setQuantityFilter(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none"
              >
                <option value="ALL">All Stock</option>
                <option value="IN_STOCK">In Stock (&ge; 50)</option>
                <option value="LOW_STOCK">Low Stock (&lt; 50)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-indigo-700 transition mt-2"
            >
              Apply Filters
            </button>

          </div>
        </div>
      )}
    </>
  );
}