import { useDebounce } from "@/hooks/debounce";
import { useSandbox } from "@/hooks/sandbox";
import { useResponsive } from "@/providers/response-provider";
import { Textarea } from "@workspace/ui/components/textarea";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

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
  const [error, setError] = useState<string | null>(null);
  const sandbox = useSandbox<RegExp>();
  const debouncedSandbox = useDebounce(sandbox, 500);

  const handleInputChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setTextInput(text);
    setError(null);
    try {
      const result = await debouncedSandbox(`${text}`);

      if (result) {
        setResult(result);
      } else {
        setError("Impossibile generare un'espressione regolare valida");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
      setResult(undefined);
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
