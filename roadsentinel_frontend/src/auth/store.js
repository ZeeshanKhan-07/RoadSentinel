import { loginUser } from "../services/AuthService";
import { getUserBalance } from "../services/walletService";
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

      totalReward: 0,
      walletLoading: false,

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

          try {
            set({ walletLoading: true });
            const balance = await getUserBalance();

            set({
              totalReward: balance,
              walletLoading: false,
            });
          } catch (err) {
            console.log("Balance fetch failed:", err);
            set({ walletLoading: false });
          }

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

      fetchBalance: async () => {
        try {
          set({ walletLoading: true });

          const balance = await getUserBalance();

          set({
            totalReward: balance,
            walletLoading: false,
          });
        } catch (error) {
          console.log(error);
          set({ walletLoading: false });
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
          authStatus: false,
          authLoading: false,
          totalReward: 0,
          walletLoading: false,
        });
      },

      checkLogin: () => {
        return get().accessToken && get().authStatus;
      },
    }),
    { name: LOCAL_KEY },
  ),
);

export default useAuth;
