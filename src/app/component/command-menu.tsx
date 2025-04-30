import { CSSProperties, forwardRef, useEffect, useRef, useState } from 'react';

import { CommandItem, CommandProps } from '@/types/command';
import React from 'react';

type GroupedCommandItems = Record<string, CommandItem[]>;

interface CommandMenuProps extends CommandProps {
  items: CommandItem[];
  command: (item: any) => void;
  clientRect: (() => DOMRect | null) | null | undefined;
}
export const CommandMenu = forwardRef<HTMLDivElement, CommandMenuProps>(
  (props, ref) => {
    const { items, command, clientRect } = props;
    const [selectedIndex, setSelectedIndex] = useState(0);
    const itemsRef = useRef<(HTMLElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const rect = clientRect?.() || new DOMRect();

    const groupedItems = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [] as CommandItem[];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as GroupedCommandItems);
    const flatItems = Object.values(groupedItems).flat();

    // Reset selection when items change
    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    // Scroll selected item into view
    useEffect(() => {
      itemsRef.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
      });
    }, [selectedIndex]);

    // Global keydown handler for navigation
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!containerRef.current) return;

        // Only handle if menu is visible
        switch (e.key) {
          case 'ArrowDown':
            setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
            e.preventDefault();
            break;
          case 'ArrowUp':
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
            e.preventDefault();
            break;
          case 'Enter':
            if (items[selectedIndex]) {
              command(items[selectedIndex]);
              // Stop the event completely
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
            }
            break;
        }
      };

      document.addEventListener('keydown', handleKeyDown, true);
      return () => document.removeEventListener('keydown', handleKeyDown, true);
    }, [items, selectedIndex, command]);

    const viewportHeight = window.innerHeight;
    const menuHeight = Math.min(items.length * 48, 300); // Dynamic height
    const spaceBelow = viewportHeight - (rect.top + rect.height + menuHeight);
    const shouldShowAbove = spaceBelow < 0;

    const style = {
      position: 'absolute',
      top: shouldShowAbove
        ? `${rect.top - menuHeight}px`
        : `${rect.top + rect.height}px`,
      left: `${rect.left}px`,
      zIndex: 9999, // Ensure it's above everything
      width: '240px',
      maxWidth: '300px',
      maxHeight: `${menuHeight}px`,
      overflow: 'auto',
    } as CSSProperties;

    return (
      <div
        ref={mergeRefs(containerRef, ref)}
        style={style}
        className="bg-white border rounded-md shadow-lg outline-none dark:bg-accent"
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault(); // Prevent editor blur
        }}
      >
        {flatItems.length === 0 ? (
          <div className="p-2 text-sm text-gray-500">No results found</div>
        ) : (
          Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category}>
              <div className="px-2 py-1.5 text-xs text-neutral-500">
                {category}
              </div>
              {categoryItems.map((item) => {
                const flatIndex = flatItems.findIndex(
                  (i) => i.title === item.title
                );
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    ref={(el) => {
                      itemsRef.current[flatIndex] = el;
                    }}
                    className={` w-full px-2 py-1.5 text-left rounded text-sm ${
                      selectedIndex === flatIndex
                        ? 'bg-neutral-100 dark:bg-neutral-700'
                        : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                    onClick={() => command(item)}
                  >
                    <div className="w-full flex items-center justify-between px-1">
                      <div className="flex item-center gap-x-2">
                        <Icon className="w-4 h-4 text-neutral-500" />
                        <div className="-translate-y-0.5 font-medium text-neutral-500 dark:text-neutral-200">
                          {item.title}
                        </div>
                      </div>
                      <p className="text-neutral-500 dark:text-neutral-200 mr-0.5">
                        {item.markdown}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>
    );
  }
);

// Helper to merge refs
function mergeRefs<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

CommandMenu.displayName = 'CommandMenu';
