import { CommandEmpty, CommandInput } from "@workspace/ui/components/command";

import {
  Command,
  CommandGroup,
  CommandList,
} from "@workspace/ui/components/command";
import { useFunctionDocs } from "@/providers/function-docs-provider";
import { useState } from "react";
import { MenuItem } from "./menu-item";

export function MenuContent() {
  const { functionDocs } = useFunctionDocs();
  const [close, setClose] = useState<boolean>(false);
  return (
    <Command>
      <CommandInput
        autoFocus
        placeholder="Type a command or search..."
        onInput={() => {
          setClose(true);
        }}
      />
      <CommandList className="max-h-[80vh] overflow-y-auto">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {functionDocs?.map((doc) => (
            <MenuItem
              key={doc.name}
              doc={doc}
              close={close}
              setClose={setClose}
            />
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
