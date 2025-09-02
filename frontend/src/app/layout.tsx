import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chatbot Agents",
  description:
    "Chatbot Agents is a cutting-edge AI platform hosted on Vercel, designed to deliver intelligent and interactive conversational experiences. It combines memory-enabled chat capabilities with curated content such as motivational quotes and entrepreneurial side hustle ideas, providing users with both practical insights and engaging interactions. Built using FastAPI and modern web technologies, Chatbot Agents ensures a seamless, responsive, and scalable experience for developers, enthusiasts, and businesses alike.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
