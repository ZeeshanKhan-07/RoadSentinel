import { create } from "zustand";
import { persist } from "zustand/middleware";

// Maps backend role names to the dashboard route for that role.
// Add new roles here as they're introduced on the backend.
export const ROLE_DASHBOARD_MAP = {
  ROLE_PRODUCT_ADMIN: "/admin/product/dashboard",
  ROLE_OFFICER: "/admin/officer/dashboard",
};

// Returns the dashboard path for a logged-in admin user, based on
// the first role of theirs that we recognize. Falls back to the
// login page if the role isn't mapped (fail-safe, not fail-open).
export const getDashboardPath = (user) => {
  const roleNames = (user?.roles || []).map((r) => r.name);
  const matchedRole = roleNames.find((name) => ROLE_DASHBOARD_MAP[name]);
  return matchedRole ? ROLE_DASHBOARD_MAP[matchedRole] : "/admin/auth/login";
};

const useAdminAuth = create(
  persist(
    (set) => ({
      admin: null,
      accessToken: null,
      refreshToken: null,
      isAdminLoggedIn: false,

      // data = full response from verify-login: { accessToken, refreshToken, user, ... }
      loginAdmin: (data) =>
        set({
          admin: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAdminLoggedIn: true,
        }),

      logoutAdmin: () =>
        set({
          admin: null,
          accessToken: null,
          refreshToken: null,
          isAdminLoggedIn: false,
        }),
    }),
    {
      name: "admin-auth",
    }
  )
);

export default useAdminAuth;