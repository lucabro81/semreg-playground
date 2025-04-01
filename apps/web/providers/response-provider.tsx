import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface ResponsiveContextType {
  isMobile: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(
  undefined
);

export function ResponsiveProvider({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const checkIfMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
    if (window.innerWidth >= 768) {
      setMobileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [checkIfMobile]);

  const value = {
    isMobile,
    mobileMenuOpen,
    setMobileMenuOpen,
  };

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export function useResponsive() {
  const context = useContext(ResponsiveContext);

  if (context === undefined) {
    throw new Error("useResponsive must be used within a ResponsiveProvider");
  }

  return context;
}
