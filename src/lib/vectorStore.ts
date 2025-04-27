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

  // Save documents to disk
  private saveToDisk() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.documents, null, 2));
      console.log(`Saved ${this.documents.length} documents to ${this.filePath}`);
    } catch (error) {
      console.error('Error saving documents to disk:', error);
    }
  }

  // Add a document to the store with error handling
  async addDocument(text: string, id?: string): Promise<string> {
    try {
      const docId = id || `doc_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      // Generate embedding with timeout and error handling
      console.log(`Generating embedding for document ${docId}...`);
      const embedding = await generateEmbedding(text);

      // Add the document to the store
      this.documents.push({
        id: docId,
        text,
        embedding
      });

      // Save to disk (this is now done in batches in addDocuments)
      // Only save here if called directly
      if (!id) {
        this.saveToDisk();
      }

      return docId;
    } catch (error) {
      console.error(`Error adding document:`, error);
      throw error;
    }
  }

  // Add multiple documents to the store with batch processing
  async addDocuments(texts: string[]): Promise<string[]> {
    const ids: string[] = [];

    // Handle empty array case
    if (!texts || texts.length === 0) {
      console.warn('No texts provided to addDocuments');
      return ids;
    }

    // Filter out empty texts
    const validTexts = texts.filter(text => text && text.trim().length > 0);

    // Process in batches to avoid overwhelming the API
    const batchSize = 5; // Process 5 documents at a time

    for (let i = 0; i < validTexts.length; i += batchSize) {
      const batch = validTexts.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(validTexts.length / batchSize)}...`);

      // Process each text in the batch
      const batchPromises = batch.map(async (text) => {
        try {
          const id = await this.addDocument(text);
          return id;
        } catch (error) {
          console.error('Error adding document:', error);
          return null; // Return null for failed documents
        }
      });

      // Wait for all documents in the batch to be processed
      const batchIds = await Promise.all(batchPromises);

      // Add successful IDs to the result
      ids.push(...batchIds.filter(id => id !== null) as string[]);

      // Save after each batch
      this.saveToDisk();

      // Add a small delay between batches to avoid rate limiting
      if (i + batchSize < validTexts.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return ids;
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

  // Clear all documents
  clearDocuments() {
    this.documents = [];
    this.saveToDisk();
  }
}
