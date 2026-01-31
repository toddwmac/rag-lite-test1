import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { getContext } from '@/lib/context';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const context = await getContext();

    const systemPrompt = context 
      ? `You are a helpful assistant. Use the following documents to answer the user's question. If the answer is not in the documents, use your general knowledge but prioritize the documents.

Documents:
${context}`
      : `You are a helpful assistant. No specific documents were provided in the context, so please answer from your general knowledge.`;

    const result = streamText({
      model: anthropic('claude-3-5-sonnet-20241022') as any,
      messages,
      system: systemPrompt,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('API ERROR:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal Server Error'
      }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
