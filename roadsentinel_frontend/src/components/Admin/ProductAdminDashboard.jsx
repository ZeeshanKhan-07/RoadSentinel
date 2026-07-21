import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Package, ShoppingCart, Truck, RefreshCw } from "lucide-react";
import { dashboardService } from "../../services/dashboardService";
import ProductAdminProfile from "../../pages/Admins/Admin/ProductAdminProfile";

export default function ProductAdminDashboard() {
  const [circularData, setCircularData] = useState([]);
  const [metrics, setMetrics] = useState({ totalUniqueProducts: 0, soldProductsCount: 0, toBeDeliveredCount: 0 });
  const [barData, setBarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [circRes, metricsRes, barRes] = await Promise.all([
          dashboardService.getCircularMetrics(),
          dashboardService.getDashboardMetrics(),
          dashboardService.getBarMetrics(),
        ]);
        setCircularData(circRes);
        setMetrics(metricsRes);
        setBarData(barRes);
      } catch (err) {
        setError(err.message || "Something went wrong while pulling dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
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

  const totalOrders = circularData.reduce((acc, curr) => acc + curr.count, 0);
  const barColors = ["#8ade35", "#3de1a7", "#3ddbe1", "#3da1e1", "#3d5be1"];

  if (loading) return <div className="h-full w-full flex items-center justify-center text-white text-xl font-semibold animate-pulse min-h-[400px]">Loading Dashboard Portfolio Metrics...</div>;
  if (error) return (
    <div className="h-full w-full flex flex-col items-center justify-center text-red-200 p-4 min-h-[400px]">
      <p className="text-lg font-bold mb-4 text-center">{error}</p>
      <button onClick={() => window.location.reload()} className="px-4 py-2 bg-white text-gray-800 rounded shadow hover:bg-gray-100 transition">Retry Request</button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      
      {/* ROW 1: PROFILE & DOUGHNUT STATUS CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 w-full">
          <ProductAdminProfile />
        </div>

        <div className="animate-card lg:col-span-7 bg-white rounded-3xl p-6 shadow-lg flex flex-col justify-between w-full">
          <h3 className="text-lg font-bold text-black mb-4 text-left">Orders Status</h3>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 h-full">
            
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#e6e6e6" strokeWidth="12" fill="transparent" />
                <circle 
                  cx="50" cy="50" r="40" 
                  stroke="#9ca3af" strokeWidth="12" fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * Math.min(totalOrders || 1, 100)) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="block text-xl sm:text-2xl font-bold text-black">{totalOrders}</span>
                <span className="text-xs text-gray-500 font-medium">Steps</span>
              </div>
            </div>

            <div className="flex-1 w-full space-y-2 max-w-sm">
              {circularData.length === 0 ? (
                <p className="text-sm text-gray-400 italic text-center">No active order metrics tracked</p>
              ) : (
                circularData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border border-gray-100 rounded-lg p-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-black"></span>
                      <span className="font-semibold text-gray-700 uppercase tracking-wider">{item.status}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-500">
                      <span className="font-bold text-gray-900 text-sm">{String(item.count).padStart(2, '0')}</span>
                      <span className="capitalize">{item.status.toLowerCase()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ROW 2: SMALL SCORE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Products", value: metrics.totalUniqueProducts, icon: Package },
          { title: "Sold Products", value: metrics.soldProductsCount, icon: ShoppingCart },
          { title: "To Be Delivered", value: metrics.toBeDeliveredCount, icon: Truck },
          { title: "Return Request", value: 7, icon: RefreshCw },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="animate-card bg-white rounded-xl p-4 shadow flex items-center space-x-4 border border-gray-100 w-full">
              <div className="p-3 bg-gray-600 rounded-xl text-white shrink-0">
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

      {/* ROW 3: DETAILED RECHARTS GRAPH BAR */}
      <div className="animate-card bg-white rounded-2xl p-4 md:p-6 shadow-xl w-full">
        <div className="mb-4">
          <h3 className="text-lg md:text-xl font-bold text-gray-800">Product Quantity Metrics</h3>
          <p className="text-xs text-gray-400">Hover elements to look up distinct UUID signatures and specific stocks metrics.</p>
        </div>
        
        <div className="w-full h-64 md:h-80 overflow-x-auto overflow-y-hidden">
          <div className="min-w-[500px] h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const { id, name, quantity } = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1 max-w-sm z-50">
                          <p className="font-bold text-emerald-400 truncate">{name}</p>
                          <p className="text-[10px] text-slate-300 break-all"><span className="text-slate-400">ID:</span> {id}</p>
                          <p className="font-semibold mt-1">Quantity Stock: <span className="text-yellow-400">{quantity}</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="quantity" radius={[15, 15, 0, 0]} maxBarSize={45}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}