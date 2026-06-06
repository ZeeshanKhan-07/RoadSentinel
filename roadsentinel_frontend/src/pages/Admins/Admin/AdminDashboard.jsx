import React from "react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-violet-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <button className="bg-white text-violet-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome Admin 👋
        </h2>

        <p className="text-gray-500 mb-8">
          This is a test dashboard to verify admin authentication and routing.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500 text-sm">Users</h3>
            <p className="text-3xl font-bold text-violet-600 mt-2">125</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500 text-sm">Products</h3>
            <p className="text-3xl font-bold text-violet-600 mt-2">48</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500 text-sm">Orders</h3>
            <p className="text-3xl font-bold text-violet-600 mt-2">312</p>
          </div>
        </div>

        {/* Placeholder Section */}
        <div className="bg-white rounded-xl shadow p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">
            Dashboard Content Area
          </h3>

          <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center">
            <p className="text-gray-400">
              Your admin modules will appear here
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}