import { create } from "zustand";

export type PortalType = "recruiter" | "portal" | null;

interface PortalState {
  portal: PortalType;
  setPortal: (value: PortalType) => void;
}

export const usePortalStore = create<PortalState>((set) => ({
  portal: null,
  setPortal: (value) => set({ portal: value }),
}));
