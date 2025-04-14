import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  generatePrompt,
  type AISuggestionResponse,
  type Rule,
  type Suggestion,
  type SuggestionRequest,
} from '@/extensions/ai-suggestion/types';
import { format } from 'path';

export async function POST(req: NextRequest) {
  try {
    console.log('inside request');
    const { content, rules, context } = await req.json();

    if (!content || !rules) {
      return NextResponse.json(
        { error: 'Missing content or rules' },
        { status: 400 }
      );
    }

    // const prompt = generatePrompt(rules, context);

    // const genAI = new GoogleGenerativeAI(
    //   process.env.NEXT_PUBLIC_GEMINI_API_KEY!
    // );
    // const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    // const formattedPrompt = prompt + `<html>${content}</html>`
    // const result = await model.generateContent(formattedPrompt);

    // const response = result.response.text();

    // console.log(`response:${response}`);
    // const match = response.match(/\{[\s\S]*\}/);
    // if (!match) {
    //   return NextResponse.json({ suggestions: [] });
    // }

    // const suggestions: AISuggestionResponse = JSON.parse(match[0]);

    // // Attach unique fallback IDs if needed
    // const withIds = suggestions.suggestions.map((s) => ({
    //   ...s,
    //   id: s.id,
    // }));

    // return NextResponse.json({ suggestions: withIds });

    // Simulated AI response
    const response = {
      suggestions: [
        {
          id: 'grammar-1',
          ruleId: 'grammar-incorrect-there',
          text: 'Their',
          position: { start: 64, end: 69 },
          replacements: [
            { id: 'option-1', text: 'There' },
            { id: 'option-2', text: "They're" },
          ],
        },
        {
          id: 'grammar-2',
          ruleId: 'grammar-sentence-end',
          text: 'sentance',
          position: { start: 82, end: 90 },
          replacements: [{ id: 'option-1', text: 'sentence' }],
        },
      ],
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error('AI suggestion error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
