import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

export default function AppLayout() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Outlet />
    </>
  );
}
