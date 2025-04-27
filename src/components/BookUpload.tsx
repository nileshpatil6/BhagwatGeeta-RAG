'use client';

import React, { useState } from 'react';

interface BookUploadProps {
  onUploadComplete: () => void;
}

export default function BookUpload({ onUploadComplete }: BookUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setUploadStatus({});

      // Check file size and show warning for very large files
      const fileSizeInMB = selectedFile.size / (1024 * 1024);
      if (fileSizeInMB > 1) {
        setUploadStatus({
          success: false,
          message: `Warning: Large file detected (${fileSizeInMB.toFixed(2)}MB). Very large files will be truncated for processing. Only the first portion will be indexed.`
        });
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return;

    setIsUploading(true);
    setUploadStatus({});

    try {
      const formData = new FormData();
      formData.append('book', file);

      const response = await fetch('/api/index', {
        method: 'POST',
        body: formData,
      });

      // Check if response is OK
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        } else {
          const text = await response.text();
          console.error('Received error response:', text);
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      // Parse the JSON response
      let data;
      try {
        data = await response.json();
      } catch (err) {
        console.error('Error parsing JSON:', err);
        throw new Error('Invalid JSON response from server');
      }

      setUploadStatus({
        success: true,
        message: data.message || 'Book uploaded and indexed successfully!',
      });
      onUploadComplete();
    } catch (error) {
      console.error('Error uploading book:', error);
      setUploadStatus({
        success: false,
        message: `Error: ${(error as Error).message || 'An error occurred while uploading the book.'}`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-300 p-6">
      <h2 className="mb-4 text-xl font-semibold">Upload Your Book</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="book-file" className="text-sm font-medium text-gray-700">
            Select a book file (.txt or .pdf)
          </label>
          <input
            id="book-file"
            type="file"
            accept=".txt,.pdf"
            onChange={handleFileChange}
            className="rounded-lg border border-gray-300 p-2"
            disabled={isUploading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: PDF (.pdf) and plain text (.txt)
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Note: Large PDF files may take longer to process.
          </p>
        </div>

        <button
          type="submit"
          disabled={!file || isUploading}
          className="w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isUploading ? 'Uploading & Indexing...' : 'Upload & Index Book'}
        </button>

        {uploadStatus.message && (
          <div
            className={`mt-4 rounded-lg p-3 ${
              uploadStatus.success
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {uploadStatus.message}
          </div>
        )}
      </form>
    </div>
  );
}
