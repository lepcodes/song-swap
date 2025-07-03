import type { Metadata } from "next";
import Providers from "@/providers/provider";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; 
// import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Song Swap",
  description: "An app to swap playlists",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body
        className={`antialiased`}
      >
        <Providers>
          {children}
          <ReactQueryDevtools />
        </Providers>
      </body>
    </html>
  );
}
