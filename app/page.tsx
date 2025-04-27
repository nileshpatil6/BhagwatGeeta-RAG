"use client";

import { useEffect } from 'react';

export default function Home() {

  useEffect(() => {
    // Redirect to the gita-chat.html page
    window.location.href = '/index.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to Bhagavad Gita Chat...</p>
    </div>
  );
}
