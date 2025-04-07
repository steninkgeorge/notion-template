import { CSSProperties, forwardRef, useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { CommandProps } from "@/types/command";

interface CommandMenuProps extends CommandProps {
  items: any[];
  command: (item: any) => void;
  clientRect: (() => DOMRect | null) | null | undefined;
}

export const CommandMenu = forwardRef<HTMLDivElement, CommandMenuProps>(
  (props, ref) => {
    const { items, command, clientRect } = props;
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [open, setOpen] = useState(true);
    const rect = clientRect?.() || new DOMRect();
    const style = {
      position: "absolute",
      top: `${rect.top + rect.height}px`,
      left: `${rect.left}px`,
      zIndex: 50,
    } as CSSProperties;

  
    return (
      <div style={style} ref={ref}>
        <Command
          className="border shadow-md rounded-md w-60"
          onKeyDownCapture={(e) => {
            e.stopPropagation();
          }}
        >
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {items.map((item, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => {
                    command(item);
                    setOpen(false);
                  }}
                >
                  {item.element || item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    );
  }
);
