import React from "react";
import useAdminAuth from "../../../auth/useAdminAuth";

export default function ProductAdminProfile() {
  const { admin } = useAdminAuth();

  return (
    <div className="animate-card bg-[#f5f5f5] rounded-3xl p-6 flex flex-col items-center justify-center shadow-lg border border-white/40 h-full min-h-[220px]">
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-emerald-100 border-2 border-white mb-4 shadow-inner">
        <img 
          src="https://api.dicebear.com/7.x/adventurer/svg?seed=Zeeshan" 
          alt="Admin Profile Avatar" 
          className="object-cover w-full h-full scale-110"
        />
      </div>
      <h3 className="text-xl md:text-2xl font-normal text-gray-700">Welcome Back!</h3>
      <h2 className="text-lg md:text-xl font-bold text-blue-700 underline decoration-2 underline-offset-4 mt-1 text-center break-words max-w-full">
        {admin?.name || "Md Zeeshan Khan"}
      </h2>
    </div>
  );
}