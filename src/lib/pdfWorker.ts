import * as pdfjsLib from 'pdfjs-dist';

// This function ensures the PDF.js worker is properly set up
export function setupPdfWorker() {
  if (typeof window !== 'undefined') {
    // Client-side only
    pdfjsLib.GlobalWorkerOptions.workerSrc = 
      `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }
}

// Call this function at the application startup
export function initPdfWorker() {
  setupPdfWorker();
}
