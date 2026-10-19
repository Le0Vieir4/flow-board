import { create } from "zustand";

export interface ToastData {
  id: string;
  title: string;
  body?: string;
  time: string;
  icon?: React.ReactNode;
  userColor?: string;
  variant?: "default" | "success" | "error" | "warning";
}

interface ToastState {
  toasts: ToastData[];
  add: (toast: Omit<ToastData, "id">) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

let toastId = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  add: (toast) => {
    const id = `toast-${++toastId}-${Date.now()}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    return id;
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

export function pushToast(toast: Omit<ToastData, "id">) {
  return useToastStore.getState().add(toast);
}