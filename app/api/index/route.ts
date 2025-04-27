import { NextRequest, NextResponse } from 'next/server';
import { indexBook } from '../../../src/scripts/indexBook';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Function to save an uploaded file
async function saveUploadedFile(formData: FormData): Promise<string> {
  const file = formData.get('book') as File;

  if (!file) {
    throw new Error('No file uploaded');
  }

  // Create a temporary directory for the book
  const tempDir = path.join(os.tmpdir(), 'book-rag');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Save the file
  const filePath = path.join(tempDir, file.name);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return filePath;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the form data safely
    let formData;
    try {
      formData = await request.formData();
    } catch (e) {
      console.error('Error parsing form data:', e);
      return NextResponse.json(
        { success: false, error: 'Invalid form data in request' },
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Check if a file was uploaded
    const file = formData.get('book') as File;
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    try {
      // Save the uploaded file
      const filePath = await saveUploadedFile(formData);

      // Create a timeout promise to prevent hanging
      const timeoutPromise = new Promise<number>((_, reject) => {
        setTimeout(() => reject(new Error('Indexing timed out after 120 seconds')), 120000); // 2 minute timeout
      });

      // Create the indexing promise
      const indexingPromise = indexBook(filePath);

      // Race the promises
      const chunkCount = await Promise.race([
        indexingPromise,
        timeoutPromise
      ]);

      return NextResponse.json({
        success: true,
        message: `Book indexed successfully. Created ${chunkCount} chunks.`
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (processingError) {
      console.error('Error processing book:', processingError);
      return NextResponse.json(
        {
          success: false,
          error: `Error processing book: ${(processingError as Error).message}`
        },
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  } catch (error) {
    console.error('Error indexing book:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
