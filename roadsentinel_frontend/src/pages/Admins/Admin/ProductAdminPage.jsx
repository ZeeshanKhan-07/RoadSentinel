import React, { useState } from "react";
import { gsap } from "gsap";
import ProductAdminDashboard from "../../../components/Admin/ProductAdminDashboard";
import ProductAdminProducts from "../../../components/Admin/ProductAdminProducts";
import ProductAdminOrders from "../../../components/Admin/ProductAdminOrders";
import ProductAdminSidebarLayout from "../../../components/Admin/ProductAdminSidebarLayout"; 
export default function ProductAdminPage() {
  const [activeSection, setActiveSection] = useState("Dashboard");

  const handleSectionChange = (sectionName) => {
    setActiveSection(sectionName);
    
    // Smooth transition clip between structural sub-modules
    gsap.fromTo(
      ".dashboard-body-content", 
      { opacity: 0.3, y: 15 }, 
      { opacity: 1, y: 0, duration: 0.35, ease: "power1.out" }
    );
  };

  return (
    <ProductAdminSidebarLayout activeSection={activeSection} onSectionChange={handleSectionChange}>
      
      {/* Dynamic Module Component Switcher */}
      <div className="dashboard-body-content flex-1 w-full">
        {activeSection === "Dashboard" && <ProductAdminDashboard />}
        {activeSection === "Products" && <ProductAdminProducts />}
        {activeSection === "Orders" && <ProductAdminOrders />}
      </div>
      
    </ProductAdminSidebarLayout>
  );
}