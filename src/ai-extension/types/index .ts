

export enum AImodel{
    Gemini= 'gemini',
}

export enum AIactionType{
    GenerateContent ='generate_content'
}

export interface AIassistantConfig{
    model: string , 
    apiKey: string
}

export type AIassistantState= {
    config: AIassistantConfig,
    isProcessing : boolean, 
    error: string | undefined,
    setConfig: (config : AIassistantConfig)=>void , 
    setIsProcessing:(isProcessing: boolean)=> void, 
    setError:(error: string | undefined)=>void
}


export const defaultConfig = {
  model: AImodel.Gemini,
  apiKey: "AIzaSyBV37JaboziWTizlSb-4xbCtn_ujGoslkE",
};

