export interface Rule {
  id: string;
  title: string;
  prompt: string;
}

export interface Suggestion {
  id: string;
  text?: string;
  replacement: string;
  from: number;
  to: number;
  isSelected?: boolean;
  isRejected?: boolean;
}

export interface SuggestionRequest {
  content: string;
  context?: string;
  rules: Rule[];
}

export type AISuggestionResponse = {
  suggestions: Suggestion[];
};

// --- Prompt Generator ---
export const generatePrompt = (rules: Rule[], context?: string): string => {
  let prompt = 'You are an AI assistant that helps improve text content. ';
  prompt +=
    'Analyze the provided HTML content and generate suggestions according to these rules:\n\n';

  rules.forEach((rule) => {
    prompt += `- ${rule.title}: ${rule.prompt}\n`;
  });

  if (context) {
    prompt += `\nAdditional context: ${context}\n`;
  }

  prompt += '\nProvide your suggestions in the following JSON format:\n';
  prompt += `{
  "suggestions": [
    {
      "id": "unique-id",
      "ruleId": "rule-id-that-triggered-this",
      "text": "text to be replaced",
      "position": { "start": X, "end": Y },
      "replacements": [
        {
          "id": "option-1",
          "text": "suggested replacement"
        }
      ]
    }
  ]
}\n`;

  return prompt;
};
