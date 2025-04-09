import { AIassistantConfig, PromptType } from '../types/index ';
import { TONE_PROMPTS } from '@/constants/ai-prompt-constants';
export abstract class BaseAI {
  protected config: AIassistantConfig;

  constructor(config: AIassistantConfig) {
    this.config = config;
  }

  abstract generateContent(prompt: PromptType): Promise<string>;

  protected formatPrompt(promptType: PromptType): string {
    //TODO: check for proper prompt validation.
    //TODO: prompt character limit

    const { content, tone, prompt, modify } = promptType;
    let formattedPrompt = prompt || '';
    if (content) {
      formattedPrompt = `${content}\n `;

      if (modify) {
        formattedPrompt += `${modify}\n`;
      }
    }

    if (tone) {
      formattedPrompt += `${TONE_PROMPTS[tone as keyof typeof TONE_PROMPTS]}\n`;
    }

    return formattedPrompt;
  }
}
