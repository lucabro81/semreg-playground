"use client";

import React, { createContext, useContext, ReactNode } from "react";

// Define interfaces for the function documentation structure
interface FunctionDocParam {
  name: string;
  description: string;
  type: string;
}

interface FunctionDocReturn {
  description: string;
  type: string;
}

export interface FunctionDoc {
  // Export this for use elsewhere
  name: string;
  description: string;
  params: FunctionDocParam[];
  return: FunctionDocReturn;
}

// Define the context shape
interface FunctionDocsContextType {
  functionDocs: FunctionDoc[] | null; // Allow null initially or if fetch fails
}

// Create the context with a default value (undefined signifies not yet provided)
const FunctionDocsContext = createContext<FunctionDocsContextType | undefined>(
  undefined
);

// Define the provider props
interface FunctionDocsProviderProps {
  children: ReactNode;
  docs: FunctionDoc[]; // Receive the fetched docs as a prop
}

// Create the provider component
export function FunctionDocsProvider({
  children,
  docs,
}: FunctionDocsProviderProps) {
  // Handle potential empty array or errors from fetch upstream
  const contextValue = { functionDocs: docs.length > 0 ? docs : null };

  return (
    <FunctionDocsContext.Provider value={contextValue}>
      {children}
    </FunctionDocsContext.Provider>
  );
}

// Create a custom hook for easy consumption
export function useFunctionDocs() {
  const context = useContext(FunctionDocsContext);
  if (context === undefined) {
    throw new Error(
      "useFunctionDocs must be used within a FunctionDocsProvider"
    );
  }
  return context;
}
