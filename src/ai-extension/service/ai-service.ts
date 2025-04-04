import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIassistantConfig } from "../types/index ";

export class GeminiService{
    private gemini: GoogleGenerativeAI;

    constructor(config: AIassistantConfig){
       

        this.gemini= new GoogleGenerativeAI(config.apiKey)
    }

    async generateContnent(prompt: string ): Promise<string> {
        try{
            const model = this.gemini.getGenerativeModel({
              model: "gemini-2.0-flash",
            });
            const result = await model.generateContent(prompt)
            const response = result.response
            return response.text()

        }catch(error){
            throw new Error(`${error}`)
        }

    }

}