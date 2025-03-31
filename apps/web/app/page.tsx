"use client";

import { useSandbox } from "@/hooks/sandbox";
import { Textarea } from "@workspace/ui/components/textarea";
import { ChangeEvent, useEffect, useState } from "react";
import * as semregLib from "semreg";
import { useDebounce } from "@/hooks/debounce";
import { MainMenu, MenuDesktop, MenuMobile } from "./components/menu";
export default function Page() {
  const [isMobile, setIsMobile] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState<RegExp | undefined>(undefined);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sandbox = useSandbox<RegExp>({
    ...semregLib,
  });
  const debouncedSandbox = useDebounce(sandbox, 500);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleInputChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setTextInput(text);

    const result = await debouncedSandbox(text);

    setResult(result);
  };

  return (
    <div className="flex flex-col h-svh">
      <MainMenu
        isMobile={isMobile}
        setMobileMenuOpen={setMobileMenuOpen}
        mobileMenuOpen={mobileMenuOpen}
      />

      <div
        className={`flex flex-1 w-full ${isMobile ? "flex-col" : "flex-row"}`}
      >
        <div className={`${isMobile ? "h-1/2 w-full" : "w-1/2 h-full"} p-4`}>
          <Textarea
            className="w-full h-full resize-none"
            placeholder="Enter text here..."
            value={textInput}
            onChange={handleInputChange}
          />
        </div>
        <div
          className={`${isMobile ? "h-1/2 w-full" : "w-1/2 h-full"} p-4 ${isMobile ? "border-b" : "border-r"}`}
        >
          {result?.source}
        </div>
      </div>
    </div>
  );
}
