/*TODO: add multiple ai models 
    auto completion of sentences and suggestions
    character limit for prompt
    stream agent response 
    error handling and loading states 
*/

export const AImodels = {
  Gemini: {
    id: 'Gemini',
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  },
  Meta: {
    id: 'Meta',
    apiKey: process.env.NEXT_PUBLIC_HF_ACCESS_TOKEN,
  },
  DeepSeek: {
    id: 'DeepSeek',
    apiKey: process.env.NEXT_PUBLIC_HF_ACCESS_TOKEN,
  },
};

export type AImodelKey = keyof typeof AImodels;

export type AImodelConfig = (typeof AImodels)[AImodelKey]; // { id: string, apiKey: string | undefined }

export enum AIactionType {
  GenerateContent = 'generate_content',
}

export interface AIassistantConfig {
  model: string;
  apiKey: string;
}

export type AIassistantState = {
  config: AIassistantConfig;
  isProcessing: boolean;
  error: string | undefined;
  setConfig: (config: AIassistantConfig) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setError: (error: string | undefined) => void;
};

export type PromptType = {
  prompt?: string;
  content?: string;
  tone?: string;
  modify?: string;
};

export const defaultConfig: AIassistantConfig = {
  model: AImodels.DeepSeek.id,
  apiKey: AImodels.DeepSeek.apiKey!,
};
