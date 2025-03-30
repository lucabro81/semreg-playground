"use client";

import { Textarea } from "@workspace/ui/components/textarea";
import { useEffect, useState } from "react";
import { MenuDesktop, MenuMobile } from "./components/menu";

export default function Page() {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if we're on mobile screen size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div className="flex flex-col h-svh">
      {/* Top menu bar - responsive */}
      <div className="w-full p-2 border-b relative">
        {isMobile ? (
          <MenuMobile
            setMobileMenuOpen={setMobileMenuOpen}
            mobileMenuOpen={mobileMenuOpen}
          />
        ) : (
          <MenuDesktop />
        )}
      </div>

      {/* Main content area - responsive split */}
      <div
        className={`flex flex-1 w-full ${isMobile ? "flex-col" : "flex-row"}`}
      >
        {/* Second section - textarea */}
        <div className={`${isMobile ? "h-1/2 w-full" : "w-1/2 h-full"} p-4`}>
          <Textarea
            className="w-full h-full resize-none"
            placeholder="Enter text here..."
          />
        </div>
        {/* First section - empty div for now */}
        <div
          className={`${isMobile ? "h-1/2 w-full" : "w-1/2 h-full"} p-4 ${isMobile ? "border-b" : "border-r"}`}
        >
          {/* This div will be filled later */}
        </div>
      </div>
    </div>
  );
}
