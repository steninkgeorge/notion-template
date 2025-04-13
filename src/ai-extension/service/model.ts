import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import { AIassistantConfig, AImodels, PromptType } from '../types/index ';
import { BaseAI } from './base';
import { InferenceClient } from '@huggingface/inference';
import { Mistral } from '@mistralai/mistralai';
import { VertexAIClient } from './vertex/vertex-client';

//TODO: fine tune ai model response
//More AI models.
//validate formatted prompts for bad prompts or misuse of prompts

class GeminiService extends BaseAI {
  private gemini: GoogleGenerativeAI;

  constructor(config: AIassistantConfig) {
    super(config);

    this.gemini = new GoogleGenerativeAI(config.apiKey!);
  }

  async generateContent(prompt: PromptType): Promise<string> {
    try {
      const model = this.gemini.getGenerativeModel({
        model: 'gemini-2.0-flash',
      });
      const formattedPrompt = this.formatPrompt(prompt);

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
    this.client = new InferenceClient(config.apiKey);
  }

  async generateContent(prompt: PromptType): Promise<string> {
    try {
      const formattedPrompt = this.formatPrompt(prompt);

      const chatCompletion = await this.client.chatCompletion({
        model: 'mlx-community/Meta-Llama-3.1-8B-Instruct-bf16',
        messages: [
          {
            role: 'user',
            content: formattedPrompt,
          },
        ],
        provider: 'novita',
        temperature: 0.5,
        max_tokens: 2048,
        top_p: 0.7,
      });
      const response = chatCompletion.choices[0].message;
      return response.content!;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}

class DeepSeekService extends BaseAI {
  private client: InferenceClient;

  constructor(config: AIassistantConfig) {
    super(config);
    this.client = new InferenceClient(config.apiKey);
  }

  async generateContent(prompt: PromptType): Promise<string> {
    try {
      const formattedPrompt = this.formatPrompt(prompt);
      const chatCompletion = await this.client.chatCompletion({
        provider: 'novita',
        model: 'deepseek-ai/DeepSeek-V3-0324',
        messages: [
          {
            role: 'user',
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

class MistralService extends BaseAI {
  private client: Mistral;

  constructor(config: AIassistantConfig) {
    super(config);
    this.client = new Mistral({ apiKey: config.apiKey });
  }

  async generateContent(prompt: PromptType): Promise<string> {
    try {
      const formattedPrompt = this.formatPrompt(prompt);

      // For non-streaming response
      const response = await this.client.chat.complete({
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'user',
            content: formattedPrompt,
          },
        ],
        temperature: 0.7,
        maxTokens: 1024,
      });

      return JSON.stringify(response?.choices?.[0]?.message?.content);
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}

class NemoService extends BaseAI {
  private client: InferenceClient;

  constructor(config: AIassistantConfig) {
    super(config);
    this.client = new InferenceClient(config.apiKey);
  }

  async generateContent(prompt: PromptType): Promise<string> {
    try {
      const formattedPrompt = this.formatPrompt(prompt);

      const chatCompletion = await this.client.chatCompletion({
        provider: 'hf-inference',
        model: 'mistralai/Mistral-Nemo-Instruct-2407',
        messages: [
          {
            role: 'user',
            content: formattedPrompt,
          },
        ],
        max_tokens: 512,
        temperature: 0.6,
      });

      const response = chatCompletion.choices[0].message;
      return response.content || '';
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}

class MistralLarge extends BaseAI {
  private client: Mistral;

  constructor(config: AIassistantConfig) {
    super(config);
    this.client = new Mistral({ apiKey: config.apiKey });
  }

  async generateContent(prompt: PromptType): Promise<string> {
    try {
      const formattedPrompt = this.formatPrompt(prompt);

      const chatCompletion = await this.client.chat.complete({
        model: 'mistral-large-latest', // or 'mistral-small-latest'
        messages: [
          {
            role: 'user',
            content: formattedPrompt,
          },
        ],
        temperature: 0.6,
        maxTokens: 1024,
      });

      const content = chatCompletion?.choices?.[0]?.message?.content;

      if (typeof content === 'string') {
        return content;
      } else if (content) {
        return JSON.stringify(content);
      } else {
        return 'No response';
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}

export const createAgent = (config: AIassistantConfig) => {
  switch (config.model) {
    case AImodels.Gemini.id:
      return new GeminiService(config);
    case AImodels.Meta.id:
      return new MetaAIservice(config);
    case AImodels.DeepSeek.id:
      return new DeepSeekService(config);
    case AImodels.MistralLarge.id:
      return new MistralLarge(config);
    case AImodels.MistralSmall.id:
      return new MistralService(config);
    case AImodels.MistralNemo.id:
      return new NemoService(config);
    default:
      return new DeepSeekService(config);
  }
};
