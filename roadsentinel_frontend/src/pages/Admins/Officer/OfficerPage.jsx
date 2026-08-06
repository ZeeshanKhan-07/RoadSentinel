import React, { useState } from "react";
import { gsap } from "gsap";
import OfficerSidebarLayout from "../../../components/Officer/OfficerSidebarLayout";
import OfficerDashboard from "../../../components/Officer/OfficerDashboard";
import OfficerComplaints from "../../../components/Officer/OfficerComplaints";

export default function OfficerPage() {
  const [activeSection, setActiveSection] = useState("Dashboard");

  const handleSectionChange = (sectionName) => {
    setActiveSection(sectionName);

    // Smooth transition clip between structural sub-modules
    gsap.fromTo(
      ".officer-body-content",
      { opacity: 0.3, y: 15 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power1.out" }
    );
  };

  return (
    <OfficerSidebarLayout
      activeSection={activeSection}
      onSectionChange={handleSectionChange}
    >
      {/* Dynamic Module Component Switcher */}
      <div className="officer-body-content flex-1 w-full">
        {activeSection === "Dashboard" && <OfficerDashboard />}
        {activeSection === "Complaints" && <OfficerComplaints />}
      </div>
    </OfficerSidebarLayout>
  );
}