import { CSSProperties, forwardRef } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import { CommandProps } from '@/types/command';
import React from 'react';

interface CommandMenuProps extends CommandProps {
  items: any[];
  command: (item: any) => void;
  clientRect: (() => DOMRect | null) | null | undefined;
}

export const CommandMenu = forwardRef<HTMLDivElement, CommandMenuProps>(
  (props, ref) => {
    const { items, command, clientRect } = props;
    const [selectedIndex, setSelectedIndex] = React.useState(0);

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

    React.useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
        console.log(e.key);
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        e.preventDefault();
      } else if (e.key === 'Enter') {
        if (items[selectedIndex]) {
          command(items[selectedIndex]);
        }
        e.preventDefault();
      }
    };
    return (
      <div style={style} ref={ref} tabIndex={0} onKeyDown={handleKeyDown}>
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
