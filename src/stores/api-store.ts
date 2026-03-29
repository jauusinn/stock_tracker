import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ApiState {
  apiKey: string;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

export const useApiStore = create<ApiState>()(
  persist(
    (set) => ({
      apiKey: "",
      setApiKey: (key) => set({ apiKey: key }),
      clearApiKey: () => set({ apiKey: "" }),
      isModalOpen: false, 
      setModalOpen: (open) => set({ isModalOpen: open }),
    }),
    {
      name: "finnhub-api-storage",
      partialize: (state) => ({ apiKey: state.apiKey }), // Strip UI booleans from local disk 
    }
  )
);
