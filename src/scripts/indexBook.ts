import { splitTextIntoChunks } from '../lib/embeddings';
import { VectorStore } from '../lib/vectorStore';
import { readBookFile } from '../lib/fileProcessing';

// Function to index the book with progress reporting and error handling
export async function indexBook(filePath: string) {
  console.log(`Indexing book from ${filePath}...`);

  try {
    // Read the book content
    const bookContent = await readBookFile(filePath);
    console.log(`Book content loaded (${bookContent.length} characters)`);

    // Validate book content
    if (!bookContent || bookContent.trim().length === 0) {
      throw new Error('Book content is empty');
    }

    // For very large books, use optimized processing but don't limit content size
    const isVeryLargeBook = bookContent.length > 1000000; // 1MB threshold

    // Process the entire book content without truncation
    const limitedContent = bookContent;

    console.log(`Processing ${limitedContent.length} characters of content (${Math.round(limitedContent.length / 1024)}KB)...`);
    console.log(`Original content size: ${Math.round(bookContent.length / 1024)}KB, processing full content`);

    // For very large books, add a small delay to allow logs to be flushed
    if (isVeryLargeBook) {
      console.log('Very large book detected. Using optimized processing...');
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Split the book into chunks with error handling
    const chunks = splitTextIntoChunks(limitedContent);
    console.log(`Split book into ${chunks.length} chunks`);

    if (chunks.length === 0) {
      throw new Error('Failed to split book into chunks');
    }

    // Process all chunks without limitation
    const limitedChunks = chunks;

    console.log(`Processing all ${chunks.length} chunks from the book`);

    // For very large books, add another small delay to allow logs to be flushed
    if (isVeryLargeBook && limitedChunks.length > 20) {
      console.log('Preparing to process chunks...');
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Create a vector store
    const vectorStore = new VectorStore();

    // Clear existing documents
    vectorStore.clearDocuments();

    // Add chunks to the vector store
    console.log('Generating embeddings and adding to vector store...');
    console.log(`This may take some time for ${limitedChunks.length} chunks. Processing in batches...`);

    const startTime = Date.now();
    const docIds = await vectorStore.addDocuments(limitedChunks);
    const endTime = Date.now();

    const processingTime = ((endTime - startTime) / 1000).toFixed(2);
    console.log(`Successfully indexed ${docIds.length} chunks from the book in ${processingTime} seconds`);

    return docIds.length;
  } catch (error) {
    console.error('Error in indexBook:', error);
    throw error;
  }
}

// If this script is run directly
if (require.main === module) {
  // Get the book file path from command line arguments
  const args = process.argv.slice(2);
  const bookFilePath = args[0];

  if (!bookFilePath) {
    console.error('Please provide a path to the book file');
    process.exit(1);
  }

  indexBook(bookFilePath)
    .then(count => {
      console.log(`Indexing complete. Added ${count} chunks to the vector store.`);
      process.exit(0);
    })
    .catch(error => {
      console.error('Error indexing book:', error);
      process.exit(1);
    });
}
