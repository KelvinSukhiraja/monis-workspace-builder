import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your workspace, made yours | monis.",
  description:
    "Build your Bali workspace. Explore desks, chairs and accessories in 3D, then preview your rental request.",
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
