import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIassistantConfig, AImodel, PromptType } from "../types/index ";
import { BaseAI } from "./base";
import { InferenceClient } from "@huggingface/inference";
import { format } from "path";

//TODO: fine tune ai model response
//TODO: Bubble menu
//More AI models. 
//validate formatted prompts for bad prompts or misuse of prompts

class GeminiService extends BaseAI {
  private gemini: GoogleGenerativeAI;

  constructor(config: AIassistantConfig) {
    super(config);
    if(!config.apiKey){
      config.apiKey = ''
    }
    this.gemini = new GoogleGenerativeAI(config.apiKey);
  }

  async generateContent(prompt: PromptType): Promise<string> {
    try {
      const model = this.gemini.getGenerativeModel({
        model: "gemini-2.0-flash",
      });
      const formattedPrompt = this.formatPrompt(prompt)

      const result = await model.generateContent(formattedPrompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}

class MetaAIservice extends BaseAI {
  private client: InferenceClient;
  constructor(config: AIassistantConfig) {
    super(config);
    this.client = new InferenceClient("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");
  }

  async generateContent(prompt: PromptType): Promise<string> {
    try {
            const formattedPrompt = this.formatPrompt(prompt);

    const chatCompletion = await this.client.chatCompletion({
      model: "mlx-community/Meta-Llama-3.1-8B-Instruct-bf16",
      messages: [
        {
          role: "user",
          content: formattedPrompt,
        },
      ],
      provider: "novita",
      temperature: 0.5,
      max_tokens: 2048,
      top_p: 0.7,
    });
    console.log(chatCompletion.choices[0].message);
    const response= chatCompletion.choices[0].message;
    return response.content!


    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}

class DeepSeekService extends BaseAI {
  private client: InferenceClient;

  constructor(config: AIassistantConfig) {
    super(config);
    this.client = new InferenceClient('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');
  }

  async generateContent(prompt: PromptType): Promise<string> {
    try {
      const formattedPrompt = this.formatPrompt(prompt);
console.log(formattedPrompt)
      const chatCompletion = await this.client.chatCompletion({
        provider: "novita",
        model: "deepseek-ai/DeepSeek-V3-0324",
        messages: [
          {
            role: "user",
            content: formattedPrompt,
          },
        ],
        max_tokens: 500,
      });
      const response = chatCompletion.choices[0].message;
      return response.content!;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}

export const createAgent = (config: AIassistantConfig) => {
  switch (config.model) {
    case AImodel.Gemini:
      return new GeminiService(config);
    case AImodel.Meta:
      return new MetaAIservice(config);
    case AImodel.DeepSeek:
      return new DeepSeekService(config);
    default:
      return new DeepSeekService(config);
  }
};
