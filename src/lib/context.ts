import { promises as fs } from 'fs';
import path from 'path';
import { existsSync } from 'fs';

export async function getFiles() {
  const dataDir = path.join(process.cwd(), 'data');
  
  if (!existsSync(dataDir)) {
    return [];
  }

  const files = await fs.readdir(dataDir);
  return files.filter(file => file.endsWith('.md') || file.endsWith('.txt') || file.endsWith('.pdf'));
}

export async function getContext(selectedFiles?: string[]) {
  const dataDir = path.join(process.cwd(), 'data');
  
  if (!existsSync(dataDir)) {
    return '';
  }

  const allFiles = await fs.readdir(dataDir);
  // If selectedFiles is provided, filter the directory list; otherwise use all valid files
  const filesToRead = selectedFiles && selectedFiles.length > 0 
    ? allFiles.filter(f => selectedFiles.includes(f))
    : allFiles;

  let context = '';

  for (const file of filesToRead) {
    const filePath = path.join(dataDir, file);
    
    try {
      if (file.endsWith('.md') || file.endsWith('.txt')) {
        const content = await fs.readFile(filePath, 'utf-8');
        context += `\n--- Document: ${file} ---\n${content}\n`;
      } else if (file.endsWith('.pdf')) {
        try {
          // Use require for the subpath to avoid ESM interop issues with some bundlers
          const pdf = require('pdf-parse/lib/pdf-parse.js');
          const dataBuffer = await fs.readFile(filePath);
          const data = await pdf(dataBuffer);
          context += `\n--- Document: ${file} (PDF) ---\n${data.text}\n`;
        } catch (pdfError: any) {
          console.error(`PDF Parse Error for ${file}:`, pdfError.message);
          context += `\n--- Document: ${file} (Error parsing PDF: ${pdfError.message}) ---\n`;
        }
      }
    } catch (error) {
      console.error(`Error reading file ${file}:`, error);
      context += `\n--- Document: ${file} (Error reading) ---\n`;
    }
  }

  return context;
}
