import { CommandItem } from "@workspace/ui/components/command";
import { useEffect, useState } from "react";
import { FunctionDoc } from "@/providers/function-docs-provider";
export function MenuItem({
  doc,
  close,
  setClose,
}: {
  doc: FunctionDoc;
  close: boolean;
  setClose: (close: boolean) => void;
}) {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (close) {
      setOpen(false);
    }
  }, [close]);

  return (
    <CommandItem
      onSelect={() => {
        setOpen(!open);
        setClose(false);
      }}
      className="hover:bg-primary/10 cursor-pointer"
    >
      <div className="flex gap-1 flex-col">
        {doc.name}
        {open && <MenuItemContent doc={doc} />}
      </div>
    </CommandItem>
  );
}

function MenuItemContent({ doc }: { doc: FunctionDoc }) {
  return (
    <div
      className="ml-4 text-xs text-muted-foreground select-text cursor-text"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold">Description</h3>
        <span className="">{doc.description}</span>
        <h3 className="text-sm font-bold">Parameters</h3>
        <div>
          {doc.params.map((param) => (
            <div key={param.name} className="flex gap-1">
              <span className="font-bold">
                {param.name} &lt;{param.type}&gt;:
              </span>
              <span className="">{param.description}</span>
            </div>
          ))}
        </div>
        <h3 className="text-sm font-bold">Returns</h3>
        <div className="flex gap-1">
          <span className="">&lt;{doc.return.type}&gt;</span>
          <span className="">{doc.return.description}</span>
        </div>
      </div>
    </div>
  );
}
