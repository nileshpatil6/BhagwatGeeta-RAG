import * as fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist';
import { setupPdfWorker } from './pdfWorker';

// Set up the worker source
setupPdfWorker();

/**
 * Extract text from a PDF file using pdf.js
 */
export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    // Set the worker source to null for server-side processing
    if (typeof window === 'undefined') {
      // We're on the server
      pdfjsLib.GlobalWorkerOptions.workerSrc = '';
    }

    // Load the PDF document with isEvalSupported: true for server-side
    const loadingTask = pdfjsLib.getDocument({
      data: pdfBuffer,
      // This is needed for server-side rendering
      isEvalSupported: false,
      // Disable range requests for server-side
      disableRange: true,
      // Disable stream for server-side
      disableStream: true
    });

    const pdf = await loadingTask.promise;

    let fullText = '';

    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');

        fullText += pageText + '\\n\\n';
      } catch (pageError) {
        console.error(`Error extracting text from page ${i}:`, pageError);
        fullText += `[Error extracting text from page ${i}]\\n\\n`;
      }
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(`Failed to extract text from PDF: ${(error as Error).message}`);
  }
}

/**
 * Read a PDF file and extract its text
 */
export async function readPDFFile(filePath: string): Promise<string> {
  try {
    // Read the file as a buffer
    const pdfBuffer = fs.readFileSync(filePath);

    // Extract text from the PDF
    return await extractTextFromPDF(pdfBuffer);
  } catch (error) {
    console.error('Error reading PDF file:', error);
    throw error;
  }
}
