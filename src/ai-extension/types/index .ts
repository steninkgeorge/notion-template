/*TODO: add multiple ai models 
    auto completion of sentences and suggestions
    character limit for prompt
    stream agent response 
    error handling and loading states 
*/

export enum AImodel{
    Gemini= 'gemini',
    Meta='meta',
    DeepSeek='deepseek'

}

export enum AIactionType{
    GenerateContent ='generate_content'
}

export interface AIassistantConfig{
    model: string , 
    apiKey?: string
}

export type AIassistantState= {
    config: AIassistantConfig,
    isProcessing : boolean, 
    error: string | undefined,
    setConfig: (config : AIassistantConfig)=>void , 
    setIsProcessing:(isProcessing: boolean)=> void, 
    setError:(error: string | undefined)=>void
}

export type PromptType={
    prompt: string , 
    content?: string , 
    tone : string , 
    modify?: string
}


export const defaultConfig = {
  model: AImodel.Gemini,
  apiKey: "AIzaSyBV37JaboziWTizlSb-4xbCtn_ujGoslkE",
};



