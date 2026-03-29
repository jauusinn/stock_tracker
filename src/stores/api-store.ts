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
      setApiKey: (key) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("finnhub_api_key", key);
        }
        set({ apiKey: key });
      },
      clearApiKey: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("finnhub_api_key");
        }
        set({ apiKey: "" });
      },
      isModalOpen: false, 
      setModalOpen: (open) => set({ isModalOpen: open }),
    }),
    {
      name: "finnhub-api-storage",
      partialize: (state) => ({ apiKey: state.apiKey }), // Strip UI booleans from local disk 
    }
  )
);
