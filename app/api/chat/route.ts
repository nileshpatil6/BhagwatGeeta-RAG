import { NextRequest, NextResponse } from 'next/server';
import { VectorStore } from '../../../src/lib/vectorStore';
import { generateResponse, streamResponse } from '../../../src/lib/gemini';

// Function to get relevant context from the vector store
async function getRelevantContexts(query: string, topK: number = 3): Promise<{ combinedContext: string; contextTexts: string[] }> {
  const vectorStore = new VectorStore();
  const relevantDocs = await vectorStore.search(query, topK);

  if (relevantDocs.length === 0) {
    return {
      combinedContext: "No relevant information found.",
      contextTexts: []
    };
  }

  // Extract the text from each document
  const contextTexts = relevantDocs.map(doc => doc.text);

  // Join the contexts for the LLM prompt
  const combinedContext = contextTexts.join('\n\n');

  return { combinedContext, contextTexts };
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body safely
    let requestData;
    try {
      requestData = await request.json();
    } catch (e) {
      console.error('Error parsing request JSON:', e);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Support both 'query' (original app) and 'prompt' (new HTML template)
    const query = requestData.query || requestData.prompt;

    if (!query) {
      return NextResponse.json(
        { error: 'Query or prompt is required' },
        { status: 400 }
      );
    }

    // Get relevant contexts from the vector store
    const { combinedContext, contextTexts } = await getRelevantContexts(query, 3);

    // Generate response
    const responseText = await generateResponse(query, combinedContext);

    // Format response for the HTML template
    return NextResponse.json({
      message: {
        response: {
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: responseText
                  }
                ]
              }
            }
          ]
        }
      },
      // Also include the original format for backward compatibility
      response: responseText,
      contexts: contextTexts
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
