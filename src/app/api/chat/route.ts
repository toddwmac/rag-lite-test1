import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { getContext } from '@/lib/context';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    console.log('API: Received request');
    console.log('API: ANTHROPIC_API_KEY set:', !!process.env.ANTHROPIC_API_KEY);
    console.log('API: API_KEY prefix:', process.env.ANTHROPIC_API_KEY?.substring(0, 10) || 'NOT SET');

    const { messages, selectedFiles, customInstructions } = await req.json();
    console.log('API: Messages received:', messages?.length || 0);
    console.log('API: Selected files:', selectedFiles || 'All');

    // Input validation
    const MAX_INPUT_LENGTH = 10000;
    const MAX_MESSAGES = 100;

    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages must be an array' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (messages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({ error: `Too many messages. Maximum: ${MAX_MESSAGES}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    for (const msg of messages) {
      if (typeof msg?.content !== 'string' || msg.content.length > MAX_INPUT_LENGTH) {
        return new Response(
          JSON.stringify({ error: `Message content too long. Maximum: ${MAX_INPUT_LENGTH} characters` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    const context = await getContext(selectedFiles);
    
    // Construct the dynamic system prompt
    const basePrompt = `You are the Applied AI Labs Intelligence Agent. Your goal is to provide professional, executive-level insights based on the provided documents.`;
    
    const contextPrompt = context 
      ? `\n\nUse the following documents to answer the user's question. If the answer is not in the documents, use your general knowledge but prioritize the documents.\n\nDocuments:\n${context}`
      : `\n\nNo specific documents were provided in the context, so please answer from your general knowledge.`;

    const tuningPrompt = customInstructions 
      ? `\n\nADDITIONAL SYSTEM INSTRUCTIONS (Follow these strictly):\n${customInstructions}`
      : `\n\nFormatting Rule: Never output raw JSON or technical metadata blocks unless specifically asked.`;

    const systemPrompt = `${basePrompt}${contextPrompt}${tuningPrompt}`;

    console.log('API: Calling streamText with model claude-3-haiku...');

    const result = streamText({
      model: anthropic('claude-3-haiku-20240307') as any,
      messages,
      system: systemPrompt,
    });

    console.log('API: streamText complete, returning stream...');
    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('API ERROR:', error);
    console.error('API ERROR stack:', error.stack);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal Server Error',
        details: error.stack
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
