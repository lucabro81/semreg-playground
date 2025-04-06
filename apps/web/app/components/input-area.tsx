import { useDebounce } from "@/hooks/debounce";
import { useSandbox } from "@/hooks/sandbox";
import { useResponsive } from "@/providers/response-provider";
import { useError } from "@/providers/error-provider";
import { Textarea } from "@workspace/ui/components/textarea";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { analyzeRegex } from "../utils";

export function InputArea({
  textInput,
  setTextInput,
  setResult,
}: {
  textInput: string;
  setTextInput: Dispatch<SetStateAction<string>>;
  setResult: Dispatch<SetStateAction<string>>;
}) {
  const { isMobile } = useResponsive();
  const { setError } = useError();
  const sandbox = useSandbox<RegExp>();
  const debouncedSandbox = useDebounce(sandbox, 500);

  const handleInputChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setTextInput(text);
    setError(null);
    try {
      const result = await debouncedSandbox(`${text}`);

      if (result) {
        console.log(result?.source);
        setResult(analyzeRegex(result?.source || ""));
      } else {
        setError("Unable to generate a valid regular expression");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setResult("");
    }
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
