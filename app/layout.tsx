import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Simple ToDo List",
  description: "A calmer way to keep track of your tasks.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
