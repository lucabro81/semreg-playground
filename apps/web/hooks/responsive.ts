import { useCallback, useEffect, useState } from "react";

export const useResponsive = () => {
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

  return {
    isMobile,
    mobileMenuOpen,
    setMobileMenuOpen,
    setIsMobile,
    checkIfMobile,
  };
};

