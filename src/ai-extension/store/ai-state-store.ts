import { create } from 'zustand';
import { AIassistantState } from '../types/index ';
import { defaultConfig } from '../types/index ';

export const useAiAssistantState = create<AIassistantState>((set) => ({
  config: defaultConfig,
  isProcessing: false,
  error: undefined,
  setConfig: (config) => set({ config }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error }),
}));
