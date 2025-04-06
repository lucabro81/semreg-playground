import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ErrorContextType {
  error: string | null;
  setError: (error: string | null) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const value = {
    error,
    setError,
  };

  return (
    <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);

  if (context === undefined) {
    throw new Error("useError must be used within a ErrorProvider");
  }

  return context;
}
