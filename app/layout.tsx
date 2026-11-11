import type { Metadata } from "next";
import "./globals.css";
import "./accounts.css";
import { AccountSessionProvider } from "@/components/account-session";

export const metadata: Metadata = {
  title: "Sidekick · Little steps, big possibilities",
  description:
    "A little support for every learner, and a clearer view for parents. Explore Math and ELA homework with Sidekick.",
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
