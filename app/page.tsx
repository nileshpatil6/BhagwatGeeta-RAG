"use client";

import { useState } from 'react';
import BookUpload from '../src/components/BookUpload';
import Chat from '../src/components/Chat';

export default function Home() {
  const [bookIndexed, setBookIndexed] = useState(false);

  const handleUploadComplete = () => {
    setBookIndexed(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold text-gray-800">Book Chat</h1>
          <p className="text-gray-600">Chat with your book using RAG and Gemini</p>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <BookUpload onUploadComplete={handleUploadComplete} />

            <div className="mt-8 rounded-lg border border-gray-300 p-6">
              <h2 className="mb-4 text-xl font-semibold">How It Works</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Upload your book as a text file (.txt) or PDF (.pdf)</li>
                <li>The system will index your book using Google's embedding model</li>
                <li>Ask questions about your book in the chat</li>
                <li>The system will find relevant passages and generate answers using Gemini</li>
                <li>View the source contexts used to generate the response</li>
              </ol>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
                <p className="font-semibold">Tip:</p>
                <p>Large PDF files may take longer to process. For best results, use text files or smaller PDFs.</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="h-[600px] rounded-lg border border-gray-300 bg-white overflow-hidden flex flex-col">
              <div className="border-b border-gray-300 p-4">
                <h2 className="text-xl font-semibold">Chat with Your Book</h2>
              </div>

              {!bookIndexed ? (
                <div className="flex flex-1 items-center justify-center p-8 text-center text-gray-500">
                  <div>
                    <p className="mb-2">Please upload and index your book first.</p>
                    <p className="text-sm">Once indexed, you can ask questions about the content.</p>
                  </div>
                </div>
              ) : (
                <Chat />
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-300 mt-8 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Book Chat - RAG Application with Next.js and Gemini</p>
        </div>
      </footer>
    </div>
  );
}
