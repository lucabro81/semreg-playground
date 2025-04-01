import { useDebounce } from "@/hooks/debounce";
import { useSandbox } from "@/hooks/sandbox";
import { useResponsive } from "@/providers/response-provider";
import { Textarea } from "@workspace/ui/components/textarea";
import { ChangeEvent } from "react";
import { SetStateAction } from "react";
import { Dispatch } from "react";
import * as semregLib from "semreg";

export function InputArea({
  textInput,
  setTextInput,
  setResult,
}: {
  textInput: string;
  setTextInput: Dispatch<SetStateAction<string>>;
  setResult: Dispatch<SetStateAction<RegExp | undefined>>;
}) {
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
    <div className={`${isMobile ? "h-1/2 w-full" : "w-1/2 h-full"} p-4`}>
      <Textarea
        className="w-full h-full resize-none"
        placeholder="Enter text here..."
        value={textInput}
        onChange={handleInputChange}
      />
    </div>
  );
}
