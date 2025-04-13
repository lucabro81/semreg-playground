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
  useState,
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
// Define a type for the caret position using DOMRect properties
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

  // const [caretPos, setCaretPos] = useState<CaretCoords>(null);
  // const [suggestions, setSuggestions] = useState<FunctionDoc[]>([]);
  // const [focusedSuggestionIndex, setFocusedSuggestionIndex] =
  //   useState<number>(-1);
  // const ignoreSuggestionsRef = useRef(false);

  const {
    caretPos,
    suggestions,
    focusedSuggestionIndex,
    ignoreSuggestionsRef,
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
  }, [textInput]);

  // --- Handle Input Event ---
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

  // // --- Function to update suggestions based on caret position ---
  // const updateSuggestions = (currentText: string, caretOffset: number) => {
  //   if (ignoreSuggestionsRef.current || !functionDocs) {
  //     setSuggestions([]);
  //     return;
  //   }

  //   let startIndex = caretOffset;
  //   while (startIndex > 0 && /\w/.test(currentText[startIndex - 1] || "")) {
  //     startIndex--;
  //   }
  //   const prefix = currentText.substring(startIndex, caretOffset).toLowerCase();

  //   if (prefix.length > 0) {
  //     const filteredDocs = functionDocs.filter((doc) =>
  //       doc.name.toLowerCase().startsWith(prefix)
  //     );
  //     setSuggestions(filteredDocs);
  //   } else {
  //     setSuggestions([]);
  //   }
  // };

  // // --- Function to get Caret Coordinates and update suggestions ---
  // const updateCaretPosition = () => {
  //   const selection = window.getSelection();
  //   let currentText = "";
  //   let caretOffset = -1;

  //   if (editableDivRef.current) {
  //     currentText = editableDivRef.current.textContent || "";
  //   }

  //   if (selection && selection.rangeCount > 0) {
  //     const range = selection.getRangeAt(0);
  //     caretOffset = range.startOffset;

  //     if (
  //       editableDivRef.current &&
  //       editableDivRef.current.contains(range.commonAncestorContainer)
  //     ) {
  //       const rect = range.getBoundingClientRect();
  //       setCaretPos({
  //         top: rect.top,
  //         left: rect.left,
  //         bottom: rect.bottom,
  //         right: rect.right,
  //         height: rect.height,
  //         width: rect.width,
  //       });
  //     } else {
  //       setCaretPos(null);
  //     }
  //   } else {
  //     setCaretPos(null);
  //   }

  //   if (caretOffset >= 0) {
  //     updateSuggestions(currentText, caretOffset);
  //   } else {
  //     setSuggestions([]);
  //   }
  // };

  // // --- Function to insert suggestion ---
  // const insertSuggestion = (suggestion: FunctionDoc) => {
  //   if (!editableDivRef.current) return;

  //   const selection = window.getSelection();
  //   if (!selection || selection.rangeCount === 0) return;

  //   const range = selection.getRangeAt(0);
  //   const currentText = editableDivRef.current.textContent || "";
  //   const caretOffset = range.startOffset;

  //   let startIndex = caretOffset;
  //   while (startIndex > 0 && /\w/.test(currentText[startIndex - 1] || "")) {
  //     startIndex--;
  //   }

  //   const textBefore = currentText.substring(0, startIndex);
  //   const textAfter = currentText.substring(caretOffset);
  //   const newText = textBefore + suggestion.name + textAfter;

  //   ignoreSuggestionsRef.current = true;
  //   setTextInput(newText);
  //   editableDivRef.current.textContent = newText;

  //   const newCaretPosition = startIndex + suggestion.name.length;
  //   range.setStart(
  //     editableDivRef.current.firstChild || editableDivRef.current,
  //     newCaretPosition
  //   );
  //   range.setEnd(
  //     editableDivRef.current.firstChild || editableDivRef.current,
  //     newCaretPosition
  //   );
  //   selection.removeAllRanges();
  //   selection.addRange(range);

  //   setSuggestions([]);
  //   setCaretPos(null);
  //   setFocusedSuggestionIndex(-1);

  //   setTimeout(() => {
  //     ignoreSuggestionsRef.current = false;
  //   }, 50);
  // };

  // // --- Handle selection changes (click, arrow keys without suggestions) ---
  // const handleSelectionChange = () => {
  //   if (ignoreSuggestionsRef.current) return;
  //   setTimeout(updateCaretPosition, 0);
  // };

  // const selectPreviousSuggestion = () => {
  //   setFocusedSuggestionIndex((prev) => Math.max(prev - 1, 0));
  // };

  // const selectNextSuggestion = () => {
  //   setFocusedSuggestionIndex((prev) =>
  //     Math.min(prev + 1, suggestions.length - 1)
  //   );
  // };

  // // --- Handle Keyboard Navigation/Insertion ---
  // const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
  //   if (suggestions.length > 0 && caretPos) {
  //     switch (e.key) {
  //       case "ArrowDown":
  //         e.preventDefault();
  //         selectNextSuggestion();
  //         break;
  //       case "ArrowUp":
  //         e.preventDefault();
  //         selectPreviousSuggestion();
  //         break;
  //       case "Enter":
  //         e.preventDefault();
  //         if (
  //           focusedSuggestionIndex >= 0 &&
  //           suggestions[focusedSuggestionIndex]
  //         ) {
  //           insertSuggestion(suggestions[focusedSuggestionIndex]);
  //         }
  //         break;
  //       case "Escape":
  //         e.preventDefault();
  //         setSuggestions([]);
  //         setCaretPos(null);
  //         break;
  //       case "Tab":
  //         if (
  //           focusedSuggestionIndex >= 0 &&
  //           suggestions[focusedSuggestionIndex]
  //         ) {
  //           e.preventDefault();
  //           insertSuggestion(suggestions[focusedSuggestionIndex]);
  //         }
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  // };

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
        <div
          key={doc.name}
          className={cn(
            "p-1 cursor-pointer rounded-sm",
            index === focusedSuggestionIndex &&
              "bg-accent text-accent-foreground"
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
      ))}
    </div>
  );
}
