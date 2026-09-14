import type { Metadata } from "next";
import "./globals.css";
import "./storybook.css";
import "./mobileSafeArea.css";

export const metadata: Metadata = {
  title: "Sysselcraft",
  description: "Real-life quests rebuild a living village.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
