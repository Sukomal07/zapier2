import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Zapier",
  description: "zapier by sukomal dutta",
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
