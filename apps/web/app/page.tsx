"use client";

import { useResponsive } from "@/providers/response-provider";
import { useState } from "react";
import { InputArea } from "./components/input-area";
import { MainMenu } from "./components/menu/menu";
import { OutputArea } from "./components/output.area";

export default function Page() {
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState("");
  const { isMobile } = useResponsive();

  return (
    <div className="flex flex-col h-svh">
      <MainMenu />

      <div
        className={`flex flex-1 w-full ${isMobile ? "flex-col" : "flex-row"}`}
      >
        <InputArea
          textInput={textInput}
          setTextInput={setTextInput}
          setResult={setResult}
        />
        <OutputArea result={result} />
      </div>
    </div>
  );
}
