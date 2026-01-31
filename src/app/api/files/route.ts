import { getFiles } from '@/lib/context';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const files = await getFiles();
    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}
