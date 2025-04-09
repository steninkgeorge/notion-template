import { useAiAssistantState } from '../store/ai-state-store';
import { createAgent } from '../service/model';
import { PromptType } from '../types/index ';

export const useAIAssistant = () => {
  const { config, ...store } = useAiAssistantState();

  const generateContent = async (prompt: PromptType) => {
    store.setIsProcessing(true);
    try {
      const agent = createAgent(config);
      const content = await agent.generateContent(prompt);
      return content;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'unknown error';
      store.setError(error);
    } finally {
      store.setIsProcessing(false);
    }
  };

  return {
    generateContent,
    isProcessing: store.isProcessing,
    error: store.error,
  };
};
