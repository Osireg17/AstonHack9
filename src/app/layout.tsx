/* eslint-disable react/react-in-jsx-scope */
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Provider } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster"

const lexend = Lexend({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TopicTutor",
  description: "A Web Application to create your own courses to learn anything you want.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(lexend.className, "antialiased min-h-screen pt-16")}>
        <Provider>
          <Navbar />
          {children}
            <Toaster />
        </Provider>
      </body>
    </html>
  );
}