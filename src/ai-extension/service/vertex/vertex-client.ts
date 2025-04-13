import { BaseAI } from '../base';
import { GoogleAuth } from 'google-auth-library';
import { AIassistantConfig, PromptType } from '@/ai-extension/types/index ';

export class VertexAIClient extends BaseAI {
  private endpointUrl: string;
  constructor(config: AIassistantConfig) {
    super(config);
    const location = config.location || 'us-central1';
    const projectId = config.projectId;
    const endpointId = config.endpointId;
    this.endpointUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/endpoints/${endpointId}:predict`;
  }

  async generateContent(prompt: PromptType): Promise<string> {
    const auth = new GoogleAuth({
      keyFile: '/Users/steninsmacbook/Downloads/service_agent_key.json',
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    if (!client || !accessToken) {
      throw new Error('unauthorized');
    }

    const formattedPrompt = this.formatPrompt(prompt);
    const inputData = {
      instances: [
        {
          prompt: formattedPrompt,
        },
      ],
      parameters: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    };

    const res = await fetch(this.endpointUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputData),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Vertex AI request failed: ${res.status} - ${error}`);
    }

    const data = await res.json();
    const prediction =
      data.predictions?.[0]?.content ||
      data.predictions?.[0]?.output ||
      JSON.stringify(data.predictions?.[0]);
    return prediction;
  }
}
