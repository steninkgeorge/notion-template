import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { MODIFICATION_PROMPTS } from '@/constants/ai-prompt-constants';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Editor } from '@tiptap/react';
import { useAIAssistant } from '@/ai-extension/hooks/use-ai-hook';

interface props {
  tone?: string;
  prompt?: string;
  modify?: string | undefined;
  content?: string | undefined;
}

export const AItools = ({ editor }: { editor: Editor | null }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<undefined | string>(undefined);
  const { generateContent, ...state } = useAIAssistant();
  const content = editor?.state.doc.textBetween(
    editor.state.selection.from,
    editor.state.selection.to,
    ' '
  );
  const handleClick = async (props: props, key: string) => {
    setSelected(key);
    setOpen(false);

    const text = await generateContent(props);
    if (text) {
      editor?.chain().focus().deleteSelection().insertContent(text).run();
    }
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className=" w-[120px] justify-evenly bg-neutral-50"
        >
          <div className="truncate">
            {' '}
            {selected || <span className="text-purple-600">AI Tools</span>}
          </div>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[180px] p-1 shadow ">
        <div className="flex flex-col text-sm">
          {Object.entries(MODIFICATION_PROMPTS).map(
            ([key, { prompt, label, icon: Icon }]) => (
              <button
                key={key}
                onClick={() =>
                  handleClick({ modify: prompt, content: content }, key)
                }
                className="flex gap-x-2 items-center px-3 py-2 hover:bg-gray-100 text-left"
              >
                <Icon className="size-4" />
                {label}
              </button>
            )
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
