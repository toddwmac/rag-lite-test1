import { promises as fs } from 'fs';
import path from 'path';
import { existsSync } from 'fs';

export async function getContext() {
  const dataDir = path.join(process.cwd(), 'data');
  
  if (!existsSync(dataDir)) {
    return '';
  }

  const files = await fs.readdir(dataDir);
  let context = '';

  for (const file of files) {
    if (file.endsWith('.md') || file.endsWith('.txt')) {
      const filePath = path.join(dataDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      context += `\n--- Document: ${file} ---\n${content}\n`;
    }
  }

  return context;
}
