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
    projectId: null,
    location: null,
    endpointId: null,
  },
  Meta: {
    id: 'Meta',
    apiKey: process.env.NEXT_PUBLIC_HF_ACCESS_TOKEN,
    projectId: null,
    location: null,
    endpointId: null,
  },
  DeepSeek: {
    id: 'DeepSeek',
    apiKey: process.env.NEXT_PUBLIC_HF_ACCESS_TOKEN,
    projectId: null,
    location: null,
    endpointId: null,
  },

  MistralLarge: {
    id: 'Mistral-Large',
    apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_KEY,
    projectId: null,
    location: null,
    endpointId: null,
  },
};

//TODO: add to env file

export type VertexModel = {
  id: string;
  projectId: string;
  location: string;
  endpointId: string;
};

export type AImodelKey = keyof typeof AImodels;

export type AImodelConfig = (typeof AImodels)[AImodelKey]; // { id: string, apiKey: string | undefined }

export enum AIactionType {
  GenerateContent = 'generate_content',
}

export type AIassistantConfig = {
  model: string;
  apiKey?: string;
  projectId?: string;
  location?: string;
  endpointId?: string;
};

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
