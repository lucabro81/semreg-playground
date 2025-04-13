"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ResponsiveProvider } from "@/providers/response-provider";
import { ErrorProvider } from "@/providers/error-provider";
import {
  FunctionDocsProvider,
  FunctionDoc,
} from "@/providers/function-docs-provider";

export function Providers({
  children,
  functionDocs,
}: {
  children: React.ReactNode;
  functionDocs: FunctionDoc[];
}) {
  return (
    <ErrorProvider>
      <ResponsiveProvider>
        <FunctionDocsProvider docs={functionDocs}>
          <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            {children}
          </NextThemesProvider>
        </FunctionDocsProvider>
      </ResponsiveProvider>
    </ErrorProvider>
  );
}
