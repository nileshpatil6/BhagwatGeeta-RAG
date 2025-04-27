'use client';

import { useEffect } from 'react';
import { initPdfWorker } from '../lib/pdfWorker';

export default function PdfWorkerInitializer() {
  useEffect(() => {
    // Initialize the PDF worker on the client side
    initPdfWorker();
  }, []);

  // This component doesn't render anything
  return null;
}
