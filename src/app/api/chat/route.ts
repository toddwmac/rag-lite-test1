import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { getContext } from '@/lib/context';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const context = await getContext();

  const systemPrompt = `You are a helpful assistant. Use the following documents to answer the user's question. If the answer is not in the documents, use your general knowledge but prioritize the documents.

Documents:
${context}`;

  const result = await streamText({
    model: anthropic('claude-3-5-sonnet-20240620'),
    messages,
    system: systemPrompt,
  });

  return result.toDataStreamResponse();
}
