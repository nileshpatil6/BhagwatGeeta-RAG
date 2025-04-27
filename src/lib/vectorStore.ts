import fs from 'fs';
import path from 'path';
import { generateEmbedding, cosineSimilarity } from './embeddings';

// Interface for a document with its embedding
export interface Document {
  id: string;
  text: string;
  embedding?: number[];
}

// Vector store class
export class VectorStore {
  private documents: Document[] = [];
  private filePath: string;

  constructor(filePath: string = 'book-embeddings.json') {
    this.filePath = path.join(process.cwd(), filePath);
    this.loadFromDisk();
  }

  // Load documents from disk
  private loadFromDisk() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf8');
        this.documents = JSON.parse(data);
        console.log(`Loaded ${this.documents.length} documents from ${this.filePath}`);
      }
    } catch (error) {
      console.error('Error loading documents from disk:', error);
    }
  }

  // Search for similar documents
  async search(query: string, topK: number = 3): Promise<Document[]> {
    if (this.documents.length === 0) {
      return [];
    }

    const queryEmbedding = await generateEmbedding(query);

    // Calculate similarity scores
    const documentsWithScores = this.documents.map(doc => {
      if (!doc.embedding) return { ...doc, score: 0 };
      const score = cosineSimilarity(queryEmbedding, doc.embedding);
      return { ...doc, score };
    });

    // Sort by similarity score (descending)
    documentsWithScores.sort((a, b) => (b as any).score - (a as any).score);

    // Return top K results
    return documentsWithScores.slice(0, topK).map(({ score, ...doc }) => doc);
  }

  // Get all documents
  getAllDocuments(): Document[] {
    return this.documents;
  }
}
