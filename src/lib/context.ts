import fs from 'fs';
import path from 'path';

export async function getContext() {
  const dataDir = path.join(process.cwd(), 'data');
  
  if (!fs.existsSync(dataDir)) {
    return '';
  }

  const files = fs.readdirSync(dataDir);
  let context = '';

  for (const file of files) {
    if (file.endsWith('.md') || file.endsWith('.txt')) {
      const filePath = path.join(dataDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      context += `\n--- Document: ${file} ---\n${content}\n`;
    }
  }

  return context;
}
