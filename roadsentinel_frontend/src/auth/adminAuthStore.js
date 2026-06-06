import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAdminAuth = create(
  persist(
    (set) => ({
      admin: null,
      accessToken: null,
      refreshToken: null,
      isAdminLoggedIn: false,

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