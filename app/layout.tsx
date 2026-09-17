import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "James",
  description: "Personal site of James, a junior at UH Manoa studying political science.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
