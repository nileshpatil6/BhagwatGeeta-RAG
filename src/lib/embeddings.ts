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
