import { useDebounce } from "@/hooks/debounce";
import { useSandbox } from "@/hooks/sandbox";
import { useResponsive } from "@/providers/response-provider";
import { useError } from "@/providers/error-provider";
import {
  Dispatch,
  SetStateAction,
  useRef,
  SyntheticEvent,
  useEffect,
  KeyboardEvent,
  RefObject,
} from "react";
import { analyzeRegex } from "../utils";
import {
  useFunctionDocs,
  FunctionDoc,
} from "@/providers/function-docs-provider";
import { cn } from "@workspace/ui/lib/utils";
import { useAutocomplete } from "@/hooks/autocomplete";

type CaretCoords = {
  top: number;
  left: number;
  bottom: number;
  right: number;
  height: number;
  width: number;
} | null;

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
  const editableDivRef = useRef<HTMLDivElement>(null);
  const { functionDocs } = useFunctionDocs();
  const {
    caretPos,
    suggestions,
    focusedSuggestionIndex,
    ignoreSuggestionsRef,
    updateCaretPosition,
    handleSelectionChange,
    handleKeyDown,
    insertSuggestion,
  } = useAutocomplete(editableDivRef, functionDocs, setTextInput, textInput);

  useEffect(() => {
    if (
      editableDivRef.current &&
      editableDivRef.current.textContent !== textInput &&
      !ignoreSuggestionsRef.current
    ) {
      editableDivRef.current.textContent = textInput;
    }
    if (ignoreSuggestionsRef.current) {
      ignoreSuggestionsRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textInput]);

  const handleInput = async (e: SyntheticEvent<HTMLDivElement>) => {
    const currentText = e.currentTarget.textContent || "";
    if (currentText !== textInput && !ignoreSuggestionsRef.current) {
      setTextInput(currentText);
    }

    setTimeout(updateCaretPosition, 0);

    setError(null);
    try {
      const result = await debouncedSandbox(`${currentText}`);
      if (result) {
        setResult(analyzeRegex(result?.source || ""));
      } else {
        setError("Unable to generate a valid regular expression");
        setResult("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setResult("");
    }
  };

  return (
    <div
      className={`${isMobile ? "h-1/2 w-full" : "w-1/2 h-full"} p-4 flex flex-col relative`}
    >
      <EditableDiv
        editableDivRef={editableDivRef}
        handleInput={handleInput}
        handleSelectionChange={handleSelectionChange}
        handleKeyDown={handleKeyDown}
      />

      {caretPos && suggestions.length > 0 && (
        <AutocompleteSuggestions
          caretPos={caretPos}
          suggestions={suggestions}
          focusedSuggestionIndex={focusedSuggestionIndex}
          insertSuggestion={insertSuggestion}
        />
      )}
    </div>
  );
}

export function EditableDiv({
  editableDivRef,
  handleInput,
  handleSelectionChange,
  handleKeyDown,
}: {
  editableDivRef: RefObject<HTMLDivElement | null>;
  handleInput: (e: SyntheticEvent<HTMLDivElement>) => void;
  handleSelectionChange: () => void;
  handleKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      ref={editableDivRef}
      autoFocus
      contentEditable={true}
      onInput={handleInput}
      onSelect={handleSelectionChange}
      onKeyDown={handleKeyDown}
      onClick={handleSelectionChange}
      className="w-full h-full resize-none overflow-auto border border-input p-2 focus:outline-none focus:border-ring focus:ring-[3px] focus:ring-ring/50 rounded-md bg-transparent shadow-xs whitespace-pre-wrap"
      suppressContentEditableWarning={true}
    ></div>
  );
}

export function AutocompleteSuggestions({
  caretPos,
  suggestions,
  focusedSuggestionIndex,
  insertSuggestion,
}: {
  caretPos: CaretCoords;
  suggestions: FunctionDoc[];
  focusedSuggestionIndex: number;
  insertSuggestion: (suggestion: FunctionDoc) => void;
}) {
  return (
    <div
      className="fixed bg-background border border-input rounded-md z-50 p-1 text-sm shadow-lg max-h-60 overflow-y-auto"
      style={{
        top: `${caretPos?.bottom}px`,
        left: `${caretPos?.left}px`,
        minWidth: "150px",
      }}
    >
      {suggestions.map((doc, index) => (
        <AutomcompleteSuggetionsItem
          key={doc.name}
          doc={doc}
          index={index}
          focusedSuggestionIndex={focusedSuggestionIndex}
          insertSuggestion={insertSuggestion}
        />
      ))}
    </div>
  );
}

export function AutomcompleteSuggetionsItem({
  doc,
  index,
  focusedSuggestionIndex,
  insertSuggestion,
}: {
  doc: FunctionDoc;
  index: number;
  focusedSuggestionIndex: number;
  insertSuggestion: (suggestion: FunctionDoc) => void;
}) {
  return (
    <div
      className={cn(
        "p-1 cursor-pointer rounded-sm",
        index === focusedSuggestionIndex && "bg-accent text-accent-foreground"
      )}
      onClick={(e) => {
        e.stopPropagation();
        insertSuggestion(doc);
      }}
      ref={(el) => {
        if (el && index === focusedSuggestionIndex) {
          el.scrollIntoView({ block: "nearest", inline: "nearest" });
        }
      }}
    >
      {doc.name}
    </div>
  );
}
