import { loginUser } from "../services/AuthService";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const LOCAL_KEY = "app_state";

const useAuth = create(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      authStatus: false,
      authLoading: false,

      changeLocalLoginData: (accessToken, user, authStatus) => {
        set({
          accessToken,
          user,
          authStatus,
        });
      },

      login: async (loginData) => {
        console.log("started login...");
        set({ authLoading: true });

        try {
          const loginResponseData = await loginUser(loginData);
          console.log(loginResponseData);

          set({
            accessToken: loginResponseData.accessToken,
            user: loginResponseData.user,
            authStatus: true,
          });

          return loginResponseData;
        } catch (error) {
          console.log(error);
          throw error;
        } finally {
          set({
            authLoading: false,
          });
        }
      },

      logout: async (silent = false) => {
        try {
          set({
            authLoading: true,
          });

          await logoutUser();
        } catch (error) {
          console.log(error);
        } finally {
          set({
            authLoading: false,
          });
        }

        set({
          accessToken: null,
          user: null,
          authLoading: false,
          authStatus: false,
        });
      },

      checkLogin: () => {
        if (get().accessToken && get().authStatus) return true;
        else return false;
      },
    }),
    { name: LOCAL_KEY }
  )
);

export default useAuth;