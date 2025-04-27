import { create } from 'zustand';

interface PanelProps {
  visible: boolean;
  setVisiblity: (visible: boolean) => void;
}

export const usePanelProps = create<PanelProps>((set) => ({
  visible: false,
  setVisiblity: (visible) => set({ visible: visible }),
}));
