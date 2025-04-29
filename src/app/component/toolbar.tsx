'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  BotIcon,
  EyeIcon,
  EyeOffIcon,
  LightbulbIcon,
  PlusIcon,
} from 'lucide-react';
import { useEditorStore } from '../store/use-editor-store';
import { ToolbarButtonProps, ToolbarItemType } from '@/types';
import { usePanelProps } from '../store/panel';
import { ThemeToggle } from '@/lib/theme/theme';

const ToolBarButton = ({
  label,
  icon: Icon,
  onClick,
  isActive,
}: ToolbarButtonProps) => {
  return (
    <div className="relative group">
      <Button
        size={'icon'}
        variant={'ghost'}
        className={cn(
          'hover:bg-neutral-300 dark:hover:bg-neutral-700 p-1 m-1',
          isActive && 'bg-neutral-300 dark:bg-neutral-700'
        )}
        onClick={onClick}
      >
        <Icon className="size-4 text-foreground" />
      </Button>
      <div>
        <span className="absolute top-full mt-1 p-0.5 font-semibold text-xs z-[10] bg-black dark:bg-white px-1.5 text-neutral-300 dark:text-neutral-700 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
          {label}
        </span>
      </div>
    </div>
  );
};

export const Toolbar = () => {
  const { editor } = useEditorStore();
  const { visible, setVisiblity } = usePanelProps();

  const handleLoadSuggestions = () => {
    if (editor) {
      console.log('Loading AI suggestions...');
      editor.commands.loadAiSuggestions();
    }
  };

  const ToolbarItem: ToolbarItemType = [
    {
      label: 'New Block',
      icon: PlusIcon,
      onClick: () => {},
      isActive: false,
    },
    {
      label: 'AI Block',
      icon: BotIcon,
      onClick: () => {
        editor
          ?.chain()
          .focus()
          .insertContent({
            type: 'AIgenerativenode',
            attrs: {
              initialPrompt: '',
            },
          })
          .run();
      },
      isActive: false,
    },
    {
      label: 'AI suggestions',
      icon: LightbulbIcon,
      onClick: handleLoadSuggestions,
      isActive: false,
    },
    {
      label: visible ? 'visible' : 'hidden',
      icon: visible ? EyeIcon : EyeOffIcon,
      onClick: () => setVisiblity(!visible),
      isActive: false,
    },
  ];

  return (
    <div className="w-full flex items-center max-w-[816px] bg-gray-200 dark:bg-neutral-700 mx-auto p-2 mt-10 rounded-sm">
      {ToolbarItem.map((item) => (
        <ToolBarButton
          key={item.label}
          label={item.label}
          icon={item.icon}
          isActive={item.isActive}
          onClick={item.onClick}
        />
      ))}
      <ThemeToggle />
    </div>
  );
};
