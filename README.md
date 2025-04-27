# Book Chat - RAG Application

This is a RAG (Retrieval-Augmented Generation) application that allows you to chat with your book. It uses Google's embedding model to index the book and Gemini to generate responses based on the retrieved context.

## Features

- Upload and index your book
- Chat with your book using natural language
- Retrieval-Augmented Generation for accurate responses
- Built with Next.js for Vercel deployment

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- Google API key with access to Gemini API

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with your Google API key:
   ```
   GOOGLE_API_KEY=your-google-api-key-here
   ```

### Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Indexing Your Book

1. Prepare your book as a text file (.txt)
2. Upload the book through the web interface
3. The system will automatically index the book

## Deployment on Vercel

This application is designed to be deployed on Vercel's free tier:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Add your Google API key as an environment variable
4. Deploy

## How It Works

1. The book is split into chunks and embedded using Google's embedding model
2. When you ask a question, the system finds the most relevant chunks using vector similarity
3. The relevant chunks are sent to Gemini along with your question
4. Gemini generates a response based on the context
