import type { Metadata } from "next";
import { Forum } from "next/font/google";
import "./globals.css";



const forum = Forum({
  variable: "--font-forum",
  subsets: ["latin"],
  weight: ["400"],
});


export const metadata: Metadata = {
  title: "Aroena",
  description: "Aroena is a website for exploring and booking any food that you want.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${forum.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
