import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { FunctionDoc } from "@/providers/function-docs-provider";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch the function documentation data
  let functionDocs: FunctionDoc[] = [];
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/lucabro81/semreg/main/data/function-docs.json"
    );
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    } else {
      functionDocs = (await response.json()).sort(
        (a: FunctionDoc, b: FunctionDoc) => a.name.localeCompare(b.name)
      );
    }
  } catch (error) {
    console.error("Failed to fetch function docs:", error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers functionDocs={functionDocs}>{children}</Providers>
      </body>
    </html>
  );
}
