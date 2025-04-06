import { Editor } from "@tiptap/react";
import { useAiAssistantState } from "../store/ai-state-store";
import { setConfig } from "next/config";
import { createAgent } from "../service/model";
import { PromptType } from "../types/index ";

interface AIAssistantHookProps {
  
  editor: Editor;
}


export const useAIAssistant = ({
  
  editor,
}: AIAssistantHookProps) => {
  const { config, ...store } = useAiAssistantState();

  const generateContent = async (prompt: PromptType) => {
    store.setIsProcessing(true);
    try {
        console.log("config", config);
      const agent = createAgent(config);
      const content = await agent.generateContent(prompt);
      return content
    } catch (err) {
      const error = err instanceof Error ? err.message : "unknown error";
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
