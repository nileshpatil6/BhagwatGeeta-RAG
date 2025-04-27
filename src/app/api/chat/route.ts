import { NextRequest, NextResponse } from 'next/server';
import { VectorStore } from '../../../lib/vectorStore';
import { generateResponse, streamResponse } from '../../../lib/gemini';

// Function to get relevant context from the vector store
async function getRelevantContext(query: string): Promise<string> {
  const vectorStore = new VectorStore();
  const relevantDocs = await vectorStore.search(query, 3);

  if (relevantDocs.length === 0) {
    return "No relevant information found.";
  }

  return relevantDocs.map(doc => doc.text).join('\n\n');
}

export async function POST(request: NextRequest) {
  try {
    const { query, stream = false } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Get relevant context from the vector store
    const context = await getRelevantContext(query);

    if (stream) {
      // For streaming responses
      const streamingResponse = await streamResponse(query, context);

      // Create a ReadableStream
      const readableStream = new ReadableStream({
        async start(controller) {
          for await (const chunk of streamingResponse.stream) {
            const text = chunk.text();
            controller.enqueue(new TextEncoder().encode(text));
          }
          controller.close();
        },
      });

      // Return the streaming response
      return new NextResponse(readableStream, {
        headers: {
          'Content-Type': 'text/plain',
          'Transfer-Encoding': 'chunked',
        },
      });
    } else {
      // For non-streaming responses
      const response = await generateResponse(query, context);

      return NextResponse.json({ response });
    }
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
