import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'ANTHROPIC_API_KEY is missing from environment variables.' 
      }, { status: 500 });
    }

    // Simple non-streaming call to verify connectivity
    const { text } = await generateText({
      model: anthropic('claude-3-haiku-20240307') as any,
      prompt: 'Reply with "Success" if you receive this.',
    });

    return NextResponse.json({ 
      success: true, 
      message: text,
      keyPrefix: apiKey.substring(0, 8) + '...'
    });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      // Include any underlying API error details if available
      details: error.data || error.cause || 'No additional details'
    }, { status: 500 });
  }
}
