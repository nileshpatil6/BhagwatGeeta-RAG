import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Book Chat - RAG Application",
  description: "Chat with your book using RAG and Gemini",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
