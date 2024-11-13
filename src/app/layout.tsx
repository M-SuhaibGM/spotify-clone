"use client"
import localFont from "next/font/local";
import "./globals.css";
import Top from "./top/page";
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from "./context.js"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black flex  `}
      >
        <UserProvider>
          <Router>
            <Top />
            {children}
          </Router>
        </UserProvider>
      </body>
    </html>
  );
}
