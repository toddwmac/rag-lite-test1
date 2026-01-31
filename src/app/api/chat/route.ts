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
    const basePrompt = `You are the Applied AI Labs Intelligence Agent. Your goal is to provide professional, executive-level insights based on the provided documents.
    
ANONYMOUS CITATION RULE: 
1. Never mention specific document filenames, titles, or extensions (e.g., do NOT say "In sample.md" or "According to the troubleshooting PDF").
2. Refer to all provided information collectively as "the knowledgebase" or "the provided documentation".
3. Maintain a seamless flow without calling out individual source identifiers.

STRICT RESPONSE RULE:
1. NO META-TALK: Never describe your tone, voice, or persona (e.g., do NOT say "*in a friendly tone*" or "As an AI assistant...").
2. Direct Action: Start your response immediately with the information requested.
3. No Roleplay: Avoid using asterisks or italics to describe your internal state or delivery style.`;
    
    const contextPrompt = context 
      ? `\n\nHIERARCHY OF TRUTH:
1. PRIMARY SOURCE: Check the provided Documents below first. If the answer is found there, prioritize it and cite the document name.
2. SECONDARY SOURCE: If the Documents do not contain the answer, you may use your general training data to provide helpful insights. However, you MUST explicitly state that the information is not in the official documentation.
3. ZERO-HALLUCINATION POLICY: Never make up data, names, dates, or technical specifications. If you are not highly certain of a fact from either source, simply state: "I cannot locate that specific information."

Documents:\n${context}`
      : `\n\nYou have no specific documents in context. Answer from your general knowledge but adhere to a strict zero-hallucination policy. If you are not highly certain of a fact, state that you do not have that information.`;

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
