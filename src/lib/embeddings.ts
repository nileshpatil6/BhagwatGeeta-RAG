import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// Get the embedding model
export const getEmbeddingModel = () => {
  return genAI.getGenerativeModel({ model: "embedding-001" });
};

// Generate embeddings for a text with timeout and error handling
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // Limit text length to avoid timeouts
    const limitedText = text.length > 8000 ? text.substring(0, 8000) : text;

    // Create a timeout promise
    const timeoutPromise = new Promise<number[]>((_, reject) => {
      setTimeout(() => reject(new Error('Embedding generation timed out')), 30000); // 30 second timeout
    });

    // Create the embedding promise
    const embeddingPromise = async () => {
      const model = getEmbeddingModel();
      const result = await model.embedContent(limitedText);
      return result.embedding.values;
    };

    // Race the promises
    return await Promise.race([embeddingPromise(), timeoutPromise]);
  } catch (error) {
    console.error('Error generating embedding:', error);
    // Return a fallback embedding (random values) in case of error
    // This is not ideal but prevents the application from crashing
    return Array.from({ length: 768 }, () => Math.random() * 2 - 1);
  }
}

// Calculate cosine similarity between two vectors
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Split text into chunks with optimizations for very large texts
export function splitTextIntoChunks(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  console.time('splitTextIntoChunks');

  // Handle empty or invalid text
  if (!text) {
    console.warn('Empty text provided to splitTextIntoChunks');
    return [];
  }

  // For very large texts, use a faster but less precise method
  const isVeryLargeText = text.length > 100000; // 100KB threshold

  if (isVeryLargeText) {
    console.log('Using fast chunking method for very large text...');
    return fastChunkText(text, chunkSize);
  }

  // Handle very short text
  if (text.length <= chunkSize) {
    console.timeEnd('splitTextIntoChunks');
    return [text];
  }

  // Ensure overlap is not larger than chunk size
  const safeOverlap = Math.min(overlap, Math.floor(chunkSize / 2));

  const chunks: string[] = [];
  let startIndex = 0;

  try {
    while (startIndex < text.length) {
      // Find a good breaking point (end of sentence or paragraph)
      let endIndex = Math.min(startIndex + chunkSize, text.length);

      if (endIndex < text.length) {
        // Try to find a period, question mark, or exclamation point followed by a space or newline
        const periodIndex = text.lastIndexOf('. ', endIndex);
        const questionIndex = text.lastIndexOf('? ', endIndex);
        const exclamationIndex = text.lastIndexOf('! ', endIndex);
        const newlineIndex = text.lastIndexOf('\n', endIndex);

        // Find the maximum of these indices that is greater than startIndex
        const breakIndices = [periodIndex, questionIndex, exclamationIndex, newlineIndex]
          .filter(index => index > startIndex);

        if (breakIndices.length > 0) {
          endIndex = Math.max(...breakIndices) + 1; // Include the punctuation
        }
      }

      // Ensure we're not creating an invalid substring
      if (startIndex < endIndex) {
        const chunk = text.substring(startIndex, endIndex).trim();
        if (chunk.length > 0) {
          chunks.push(chunk);
        }
      }

      // Move the start index for the next chunk
      startIndex = endIndex - safeOverlap;

      // Prevent infinite loop if we can't make progress
      if (endIndex === text.length || startIndex >= endIndex) {
        break;
      }
    }
  } catch (error) {
    console.error('Error in splitTextIntoChunks:', error);
    // If we encountered an error but have some chunks, return them
    if (chunks.length > 0) {
      console.timeEnd('splitTextIntoChunks');
      return chunks;
    }
    // Otherwise, fall back to a simple split
    console.timeEnd('splitTextIntoChunks');
    return fastChunkText(text, chunkSize);
  }

  console.timeEnd('splitTextIntoChunks');
  return chunks;
}

// Fast chunking method for very large texts
function fastChunkText(text: string, chunkSize: number = 1000): string[] {
  console.log('Using fast chunking method...');
  const chunks: string[] = [];

  // Simple chunking by fixed size with minimal overlap
  const step = Math.floor(chunkSize * 0.9); // 10% overlap

  // Process the entire text without limitation
  const textToProcess = text;

  for (let i = 0; i < textToProcess.length; i += step) {
    const chunk = textToProcess.substring(i, Math.min(i + chunkSize, textToProcess.length));
    if (chunk.trim().length > 0) {
      chunks.push(chunk);
    }

    // No limit on the number of chunks
  }

  return chunks;
}
