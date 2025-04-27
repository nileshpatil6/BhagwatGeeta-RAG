# Book Chat - Minimal RAG Application

This is a minimal RAG (Retrieval-Augmented Generation) application that allows you to chat with pre-indexed book content. It uses Google's Gemini model to generate responses based on retrieved context from stored embeddings.

## Features

- Chat with pre-indexed book content using natural language
- Retrieval-Augmented Generation for accurate responses
- Built with Next.js for Vercel deployment
- Simple HTML/JS interface

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
npm run serve
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

This application is designed to be deployed on Vercel's free tier:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Add your Google API key as an environment variable
4. Deploy

## How It Works

1. The application loads pre-indexed embeddings from the book-embeddings.json file
2. When you ask a question, the system finds the most relevant chunks using vector similarity
3. The relevant chunks are sent to Gemini along with your question
4. Gemini generates a response based on the context
