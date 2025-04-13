declare module 'textarea-caret-position' {
  export interface Position {
    top: number;
    left: number;
    height: number;
  }

  export default function getCaretCoordinates(element: HTMLInputElement | HTMLTextAreaElement, position: number, options?: { debug?: boolean }): Position;
} 