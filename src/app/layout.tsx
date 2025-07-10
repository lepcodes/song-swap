import type { Metadata } from "next";
import Providers from "@/providers/provider";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; 
import { Roboto } from "next/font/google";
import "../styles/globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

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
        className={`antialiased ${roboto.className}`}
      >
        <Providers>
          {children}
          <ReactQueryDevtools />
        </Providers>
      </body>
    </html>
  );
}
