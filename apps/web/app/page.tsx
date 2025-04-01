"use client";

import { useDebounce } from "@/hooks/debounce";
import { useResponsive } from "@/hooks/responsive";
import { useSandbox } from "@/hooks/sandbox";
import { Textarea } from "@workspace/ui/components/textarea";
import { ChangeEvent, useState } from "react";
import * as semregLib from "semreg";
import { MainMenu } from "./components/menu";

export default function Page() {
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState<RegExp | undefined>(undefined);
  const { isMobile } = useResponsive();
  const sandbox = useSandbox<RegExp>({
    ...semregLib,
  });
  const debouncedSandbox = useDebounce(sandbox, 500);

  const handleInputChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setTextInput(text);
    const result = await debouncedSandbox(text);
    setResult(result);
  };

  return (
    <div className="flex flex-col h-svh">
      <MainMenu />

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
