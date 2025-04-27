import fs from 'fs';
import path from 'path';

/**
 * Read text from a file (supports .txt and .pdf)
 * Using a simple approach for PDF parsing that works in serverless environments
 */
export async function readBookFile(filePath: string): Promise<string> {
  try {
    console.log(`Reading file from: ${filePath}`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Get file extension
    const fileExt = path.extname(filePath).toLowerCase();

    // Process based on file type
    if (fileExt === '.pdf') {
      console.log('Processing PDF file...');
      // For PDFs, we'll extract text using a simple approach
      // This is a temporary solution that works in serverless environments
      const buffer = fs.readFileSync(filePath);

      // Convert buffer to string and look for text patterns
      const bufferStr = buffer.toString('utf-8', 0, Math.min(buffer.length, 10000000));

      // Simple text extraction - look for text between parentheses which often contains content in PDFs
      let text = '';
      const regex = /\(([^\)]+)\)/g;
      let match;

      while ((match = regex.exec(bufferStr)) !== null) {
        // Only add if it looks like text (contains letters)
        if (/[a-zA-Z]{2,}/.test(match[1])) {
          text += match[1] + ' ';
        }
      }

      // If we couldn't extract text, return a message
      if (text.trim().length < 100) {
        console.log('Could not extract meaningful text from PDF. Treating as text file...');
        // Try to read it as a text file as a fallback
        try {
          return fs.readFileSync(filePath, 'utf8');
        } catch (e) {
          throw new Error('This PDF file format is not supported. Please convert it to a text file.');
        }
      }

      return text;
    } else if (fileExt === '.txt') {
      console.log('Processing text file...');
      return fs.readFileSync(filePath, 'utf8');
    } else {
      throw new Error(`Unsupported file type: ${fileExt}. Only .txt and .pdf files are supported.`);
    }
  } catch (error) {
    console.error('Error reading book file:', error);
    throw error;
  }
}
