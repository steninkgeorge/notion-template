import { CSSProperties, forwardRef } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import { CommandProps } from '@/types/command';

interface CommandMenuProps extends CommandProps {
  items: any[];
  command: (item: any) => void;
  clientRect: (() => DOMRect | null) | null | undefined;
}

export const CommandMenu = forwardRef<HTMLDivElement, CommandMenuProps>(
  (props, ref) => {
    const { items, command, clientRect } = props;
    const rect = clientRect?.() || new DOMRect();

    const viewportHeight = window.innerHeight;
    const menuHeight = 180; // Approximate height of your command menu
    // Calculate if there's enough space below the cursor
    const spaceBelow = viewportHeight - (rect.top + rect.height + menuHeight);
    const shouldShowAbove = spaceBelow < 0; // Not enough space below

    const style = {
      position: 'absolute',
      top: shouldShowAbove
        ? `${rect.top - menuHeight}px` // Show above
        : `${rect.top + rect.height}px`, // Show below
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

CommandMenu.displayName = 'CommandMenu';
