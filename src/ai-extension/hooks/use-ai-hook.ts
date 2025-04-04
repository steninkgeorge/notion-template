import { Editor } from "@tiptap/react"
import { useAiAssistantState } from "../store/ai-state-store"
import { setConfig } from "next/config"
import { GeminiService } from "../service/ai-service"

interface AIAssistantHookProps{
    model? : string , 
    apiKey?: string,
    editor : Editor
}

export const useAIAssistant= ({model , apiKey, editor}:AIAssistantHookProps)=>{
    const {config, ...store} = useAiAssistantState()
    //if user provided api key and model 
    if(apiKey && model){
        store.setConfig({apiKey, model})
    }    

    //else go with default model 

    const generateContent = async (prompt: string)=>{
        store.setIsProcessing(true)
        try{
            const agent = new GeminiService(config);
        const content = await agent.generateContnent(prompt);
        editor.commands.insertContent(content)
         
        }catch(err){
            const error = err instanceof Error ? err.message : 'unknown error'
            store.setError(error)
        }
        finally{
            store.setIsProcessing(false)
        }
    }

    return {generateContent , isProcessing: store.isProcessing, error: store.error}


}