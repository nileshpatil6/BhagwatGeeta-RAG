import { NextRequest, NextResponse } from 'next/server';
import { indexBook } from '../../../scripts/indexBook';
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
    const formData = await request.formData();

    // Save the uploaded file
    const filePath = await saveUploadedFile(formData);

    // Index the book
    const chunkCount = await indexBook(filePath);

    return NextResponse.json({
      success: true,
      message: `Book indexed successfully. Created ${chunkCount} chunks.`
    });
  } catch (error) {
    console.error('Error indexing book:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
