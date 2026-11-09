import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sidekick · Read your worksheet",
  description:
    "A little clarity for your next step. Take a photo of a Math or ELA worksheet to see the questions and your work, just as you wrote them.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
