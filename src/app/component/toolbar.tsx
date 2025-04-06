"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon, LucideIcon, MessageSquareIcon, PenIcon, PlusIcon } from "lucide-react";
import { useEditorStore } from "../store/use-editor-store";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useAIAssistant } from "@/ai-extension/hooks/use-ai-hook";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AImodel } from "@/ai-extension/types/index ";
import { useAiAssistantState } from "@/ai-extension/store/ai-state-store";
import { MODIFICATION_PROMPTS, TONE_PROMPTS } from "@/constants/ai-prompt-constants";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { useEditor } from "@tiptap/react";
import { MarkdownEditor } from "./preview-editor";





interface ToolbarButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive: boolean;
}

type ToolbarItemType = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive: boolean;
}[];

const ToolBarButton = ({
  label,
  icon: Icon,
  onClick,
  isActive,
}: ToolbarButtonProps) => {
  const { editor } = useEditorStore();
  return (
    <div className="relative group ">
      <Button
        size={"icon"}
        variant={"ghost"}
        className={cn(
          "hover:bg-neutral-300 p-1 m-1 ",
          isActive && "bg-neutral-300"
        )}
        onClick={() => {
          editor
            ?.chain()
            .focus()
            .insertContent({
              type: "draggableItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "New draggable block",
                    },
                  ],
                },
              ],
            })
            .run();
        }}
      >
        <Icon className="size-4" />
      </Button>
      <div>
        <span className="absolute top-full mt-1 p-0.5 font-semibold   text-xs z-[10] bg-black px-1.5 text-neutral-300 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
          {label}
        </span>
      </div>
    </div>
  );
};

interface props {
  tone: string;
  prompt: string;
  modify: string | undefined;
  content: string | undefined;
}

const AIagentComponent = () => {
  const { editor } = useEditorStore();
  const { generateContent, ...state } = useAIAssistant({ editor: editor! });
  const { setConfig } = useAiAssistantState();
  const [isOpen, setIsOpen] = React.useState(state.isProcessing);
  const [input, setInput] = useState("");
  const [model, setModel] = useState(AImodel.Gemini as string);
  const [tone, setTone] = useState(TONE_PROMPTS.casual as string);
  const [preview, setPreview] = useState<undefined | string>(undefined);
  const [modify, setModify] = useState<undefined | string>(undefined);
  const [insert, setInsertContent] = useState(false);
  const [regenerate, setRegenerate]= useState(false)
  
  //agent tone
  //preview , regenerate and insert options
  //modify option enabled if preview is true

  const handleGenerate = async (e: React.MouseEvent, props: props) => {
    e.preventDefault();
    console.log("handle click");

    await generateContent(props).then((content) => {
      setPreview(content);
      
    }).finally(()=>{setInsertContent(true); setRegenerate(true)})
  };

  const handleConfig = (model: string) => {
    setConfig({ model: model });
    setModel(model);
  };

  const handleTone = (tone: string) => {
    setTone(tone);
  };
   const handleModify = (modify: string) => {
     setModify(modify);
   };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="hover:bg-neutral-300">
          <MessageSquareIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col  ">
        <DialogHeader>
          <DialogTitle>Write your thoughts here.. </DialogTitle>
        </DialogHeader>
        {preview && (
         <MarkdownEditor content={preview}/>
        )}
        <Input
          className="w-full border-1   truncate focus-visible:border-none focus-visible:outline-0 outline-none px-1.5"
          placeholder="Tell us a dad joke! , write a story..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <DialogFooter className="flex gap-x-4 justify-end item-cente overflow-x-auto">
          <Select value={tone} onValueChange={(tone) => handleTone(tone)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={`${tone}`} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TONE_PROMPTS).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            disabled={!insert}
            value={modify}
            onValueChange={(modify) => handleModify(modify)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={modify || "modify"} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(MODIFICATION_PROMPTS).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={model} onValueChange={(model) => handleConfig(model)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={`${model}`} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(AImodel).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {key.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {insert && (
            <Button
              disabled={state.isProcessing}
              onClick={() => {
                editor?.commands.insertContent(preview as string)

                setInsertContent(false);
                setPreview(undefined);
                setRegenerate(false);
                setInput("");
                setIsOpen(false)
              }}
              variant={"ghost"}
            >
              <CheckIcon className="size-4" />
              <span className="text-neutral-400">Insert</span>
            </Button>
          )}

          <div className="flex item-center justify-center">
            <Button
              disabled={state.isProcessing}
              onClick={(e) =>
                handleGenerate(e, {
                  prompt: input.trim(),
                  tone: tone,
                  modify: modify,
                  content: preview,
                })
              }
            >
              <PenIcon className="size-4" />
              {state.isProcessing
                ? "Generating..."
                : regenerate
                ? "Regenerate"
                : "Generate"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ToolbarItem: ToolbarItemType = [
  {
    label: "New Block",
    icon: PlusIcon,
    onClick: () => {},
    isActive: false,
  },
];

export const Toolbar = () => {
  return (
    <div className="w-full flex items-center max-w-[816px] bg-gray-200 mx-auto p-2 mt-10 rounded-sm">
      {ToolbarItem.map((item, index) => (
        <ToolBarButton
          key={item.label}
          label={item.label}
          icon={item.icon}
          isActive={item.isActive}
          onClick={item.onClick}
        />
      ))}
      <AIagentComponent />
    </div>
  );
};
