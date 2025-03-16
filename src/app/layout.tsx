import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Joytask - Celebrate Task Completion",
  description:
    "A to-do list app that celebrates task completion and helps you stay organized with a beautiful, intuitive interface",
  keywords: [
    "task management",
    "to-do list",
    "productivity",
    "task tracking",
    "task completion",
    "celebration",
  ],
  authors: [{ name: "Joytask Team" }],
  openGraph: {
    title: "Joytask - Celebrate Task Completion",
    description:
      "A to-do list app that celebrates task completion and helps you stay organized",
    url: "https://joytask.vercel.app",
    siteName: "Joytask",
    images: [
      {
        url: "/og-image.jpg", // You'll need to add this image to your public folder
        width: 1200,
        height: 630,
        alt: "Joytask - Celebrate Task Completion",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joytask - Celebrate Task Completion",
    description: "A to-do list app that celebrates task completion",
    images: ["/og-image.jpg"], // Same image as OpenGraph
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <main className="container mx-auto px-4 py-8 max-w-4xl">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
