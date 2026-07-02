import { create } from "zustand";

const useAuthStore = create((set) => ({
  role: null,

  userId: null,

  accessToken: null,

  setRole: (role) => set({ role }),

  setUserId: (userId) => set({ userId }),

  setAccessToken: (newAccessToken) => set({ accessToken: newAccessToken }),

  clearAuth: () => set({ accessToken: null, userId: null, role: null }),
}));

export default useAuthStore;
