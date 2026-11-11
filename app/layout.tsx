import type { Metadata } from "next";
import "./globals.css";
import "./accounts.css";
import "./learning.css";
import { AccountSessionProvider } from "@/components/account-session";

export const metadata: Metadata = {
  title: "Sidekick · Little steps, big possibilities",
  description:
    "A little support for every learner, and a clearer view for parents. Explore Math and ELA worksheets, quizzes, tests, and other student work with Sidekick.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AccountSessionProvider>{children}</AccountSessionProvider>
      </body>
    </html>
  );
}
