import { useEditorStore } from '@/app/store/use-editor-store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ToolbarItemType } from '@/types';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@radix-ui/react-popover';
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ChevronUpIcon,
  SubscriptIcon,
  SuperscriptIcon,
} from 'lucide-react';
import { useState } from 'react';

export const MoreOptions = () => {
  const { editor } = useEditorStore();

  const [open, setOpen] = useState(false);

  const moreOptionsItems: ToolbarItemType = [
    {
      label: 'superscript',
      icon: SuperscriptIcon,
      onClick: () => editor?.chain().focus().toggleSuperscript().run(),
      isActive: editor?.isActive('superscript') ?? false,
    },
    {
      label: 'subscript',
      icon: SubscriptIcon,
      onClick: () => editor?.chain().focus().toggleSubscript().run(),
      isActive: editor?.isActive('subscript') ?? false,
    },
  ];

  const icons = [
    {
      label: 'left',
      icon: AlignLeftIcon,
      onClick: () => {
        editor?.chain().focus().setTextAlign('left').run();
      },
      isActive: editor?.isActive({ textAlign: 'left' }),
    },
    {
      label: 'right',
      icon: AlignRightIcon,
      onClick: () => editor?.chain().focus().setTextAlign('right').run(),
      isActive: editor?.isActive({ textAlign: 'right' }),
    },
    {
      label: 'center',
      icon: AlignCenterIcon,
      onClick: () => editor?.chain().focus().setTextAlign('center').run(),
      isActive: editor?.isActive({ textAlign: 'center' }),
    },
    {
      label: 'justify',
      icon: AlignJustifyIcon,
      onClick: () => editor?.chain().focus().setTextAlign('justify').run(),
      isActive: editor?.isActive({ textAlign: 'justify' }),
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className=" min-w-[60px] justify-evenly bg-neutral-50"
        >
          <ChevronUpIcon className="size-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-1 shadow bg-white  ">
        <div className="flex gap-x-1 ">
          {moreOptionsItems.map(({ icon: Icon, ...item }) => (
            <div key={item.label}>
              <Button size={'icon'} className="bg-white hover:bg-neutral-100">
                <Icon className="size-4 text-neutral-400" />
              </Button>
              <div key={item.label}>
                <span className="absolute top-full mt-1 p-0.5 font-semibold   text-xs z-[10] bg-black px-1.5 text-neutral-300 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
          <Separator orientation="vertical" />
          {icons.map(({ label, icon: Icon, onClick, isActive }) => (
            <Button
              size={'icon'}
              className={cn(
                'bg-white hover:bg-neutral-100',
                isActive && 'bg-neutral-100 '
              )}
              key={label}
              onClick={onClick}
            >
              <Icon className="size-4 text-neutral-400" />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
