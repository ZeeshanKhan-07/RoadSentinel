import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { LayoutDashboard, ShieldAlert, LogOut } from "lucide-react";
import useAdminAuth from "../../auth/useAdminAuth";

export default function OfficerSidebarLayout({ children, activeSection, onSectionChange }) {
  const { logoutAdmin } = useAdminAuth();
  const navRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, []);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Complaints", icon: ShieldAlert },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[#e6e7eb] font-sans text-gray-800">
      
      {/* SIDEBAR NAVIGATION SHELL */}
      <aside 
        ref={navRef} 
        className="w-full md:w-64 bg-white flex flex-col md:justify-between border-b md:border-b-0 md:border-r border-gray-200 z-50 shrink-0"
      >
        <div className="flex md:flex-col items-center justify-between md:items-stretch p-4 md:p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-black rounded-full"></div>
            <span className="text-lg md:text-xl font-bold tracking-tight text-gray-900">OFFICER PORTAL</span>
          </div>
          
          <button 
            onClick={logoutAdmin} 
            className="md:hidden p-2 text-gray-500 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible px-2 py-2 md:p-3 space-x-2 md:space-x-0 md:space-y-1 scrollbar-none flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.name;
            return (
              <button
                key={item.name}
                onClick={() => onSectionChange(item.name)}
                className={`flex items-center space-x-2 md:space-x-3 px-4 py-2 md:py-3 text-xs md:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                  isActive 
                    ? "bg-[#eeeeee] text-black font-semibold shadow-sm" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-black"
                }`}
              >
                <Icon className="h-4 w-4 md:h-5 md:w-5" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="hidden md:block p-4 border-t border-gray-100">
          <button 
            onClick={logoutAdmin} 
            className="w-full flex items-center cursor-pointer space-x-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* RENDER CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 md:p-8 relative">
        {children}
      </main>
    </div>
  );
}