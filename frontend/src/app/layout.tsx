import { config } from "@/config";
import { cookieToInitialState } from "@account-kit/core";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";
import { Source_Code_Pro } from "next/font/google";
const sourcecodepro = Source_Code_Pro({ subsets: ["latin"] });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VerdictVault",
  description: "VerdictVault",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This will allow us to persist state across page boundaries (read more here: https://accountkit.alchemy.com/react/ssr#persisting-the-account-state)
  const initialState = cookieToInitialState(
    config,
    headers().get("cookie") ?? undefined
  );

  return (
    <html lang="en">
      <body className={sourcecodepro.className}>
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
