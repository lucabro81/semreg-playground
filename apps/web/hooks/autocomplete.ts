import {
  useState,
  useRef,
  useCallback,
  useEffect,
  RefObject,
  Dispatch,
  SetStateAction,
  KeyboardEvent,
} from "react";
import { FunctionDoc } from "@/providers/function-docs-provider"; // Adjust path if needed

// Re-define CaretCoords type here or import from a shared types file
export type CaretCoords = {
  top: number;
  left: number;
  bottom: number;
  right: number;
  height: number;
  width: number;
} | null;

export function useAutocomplete(
  editableDivRef: RefObject<HTMLDivElement | null>,
  functionDocs: FunctionDoc[] | null,
  setTextInput: Dispatch<SetStateAction<string>>, // Need this for insertion
  currentTextInput: string // Need current text for insertion logic
) {
  const [caretPos, setCaretPos] = useState<CaretCoords>(null);
  const [suggestions, setSuggestions] = useState<FunctionDoc[]>([]);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] =
    useState<number>(-1);
  const ignoreSuggestionsRef = useRef(false);

  // Reset focused index when suggestions change
  useEffect(() => {
    setFocusedSuggestionIndex(-1);
  }, [suggestions]);

  // --- Suggestion Filtering Logic ---
  // --- Function to update suggestions based on caret position ---
  const updateSuggestions = (currentText: string, caretOffset: number) => {
    if (ignoreSuggestionsRef.current || !functionDocs) {
      setSuggestions([]);
      return;
    }

    let startIndex = caretOffset;
    while (startIndex > 0 && /\w/.test(currentText[startIndex - 1] || "")) {
      startIndex--;
    }
    const prefix = currentText.substring(startIndex, caretOffset).toLowerCase();

    if (prefix.length > 0) {
      const filteredDocs = functionDocs.filter((doc) =>
        doc.name.toLowerCase().startsWith(prefix)
      );
      setSuggestions(filteredDocs);
    } else {
      setSuggestions([]);
    }
  };

  // --- Function to get Caret Coordinates and update suggestions ---
  const updateCaretPosition = () => {
    const selection = window.getSelection();
    let currentText = "";
    let caretOffset = -1;

    if (editableDivRef.current) {
      currentText = editableDivRef.current.textContent || "";
    }

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      caretOffset = range.startOffset;

      if (
        editableDivRef.current &&
        editableDivRef.current.contains(range.commonAncestorContainer)
      ) {
        const rect = range.getBoundingClientRect();
        setCaretPos({
          top: rect.top,
          left: rect.left,
          bottom: rect.bottom,
          right: rect.right,
          height: rect.height,
          width: rect.width,
        });
      } else {
        setCaretPos(null);
      }
    } else {
      setCaretPos(null);
    }

    if (caretOffset >= 0) {
      updateSuggestions(currentText, caretOffset);
    } else {
      setSuggestions([]);
    }
  };

  // --- Function to insert suggestion ---
  const insertSuggestion = (suggestion: FunctionDoc) => {
    if (!editableDivRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const currentText = editableDivRef.current.textContent || "";
    const caretOffset = range.startOffset;

    let startIndex = caretOffset;
    while (startIndex > 0 && /\w/.test(currentText[startIndex - 1] || "")) {
      startIndex--;
    }

    const textBefore = currentText.substring(0, startIndex);
    const textAfter = currentText.substring(caretOffset);
    const newText = textBefore + suggestion.name + textAfter;

    ignoreSuggestionsRef.current = true;
    setTextInput(newText);
    editableDivRef.current.textContent = newText;

    const newCaretPosition = startIndex + suggestion.name.length;
    range.setStart(
      editableDivRef.current.firstChild || editableDivRef.current,
      newCaretPosition
    );
    range.setEnd(
      editableDivRef.current.firstChild || editableDivRef.current,
      newCaretPosition
    );
    selection.removeAllRanges();
    selection.addRange(range);

    setSuggestions([]);
    setCaretPos(null);
    setFocusedSuggestionIndex(-1);

    setTimeout(() => {
      ignoreSuggestionsRef.current = false;
    }, 50);
  };

  // --- Handle selection changes (click, arrow keys without suggestions) ---
  const handleSelectionChange = () => {
    if (ignoreSuggestionsRef.current) return;
    setTimeout(updateCaretPosition, 0);
  };

  const selectPreviousSuggestion = () => {
    setFocusedSuggestionIndex((prev) => Math.max(prev - 1, 0));
  };

  const selectNextSuggestion = () => {
    setFocusedSuggestionIndex((prev) =>
      Math.min(prev + 1, suggestions.length - 1)
    );
  };

  // --- Handle Keyboard Navigation/Insertion ---
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (suggestions.length > 0 && caretPos) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          selectNextSuggestion();
          break;
        case "ArrowUp":
          e.preventDefault();
          selectPreviousSuggestion();
          break;
        case "Enter":
          e.preventDefault();
          if (
            focusedSuggestionIndex >= 0 &&
            suggestions[focusedSuggestionIndex]
          ) {
            insertSuggestion(suggestions[focusedSuggestionIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setSuggestions([]);
          setCaretPos(null);
          break;
        case "Tab":
          if (
            focusedSuggestionIndex >= 0 &&
            suggestions[focusedSuggestionIndex]
          ) {
            e.preventDefault();
            insertSuggestion(suggestions[focusedSuggestionIndex]);
          }
          break;
        default:
          break;
      }
    }
  };

  return {
    caretPos,
    suggestions,
    focusedSuggestionIndex,
    handleKeyDown,
    handleSelectionChange,
    insertSuggestion, // Expose for direct click handling on suggestions
    ignoreSuggestionsRef, // Expose ref if needed by parent for edge cases
  };
}
