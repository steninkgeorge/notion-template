import { VertexAIClient } from '@/ai-extension/service/vertex/vertex-client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { prompt, tone, modify, content } = req.body;
      // Initialize your VertexAIClient (adjust the config as needed)
      const client = new VertexAIClient({
        model: 'Mistral-Vertex',
        projectId: '869052295818',
        location: 'us-central1',
        endpointId: '8490997237197832192',
      });

      // Call the generateContent function of your client
      const generatedContent = await client.generateContent({
        prompt,
        tone,
        modify,
        content,
      });

      // Return the generated content to the frontend
      res.status(200).json({ content: generatedContent });
    } catch (error) {
      res.status(500).json({ error: `Failed to generate content:${error}` });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
