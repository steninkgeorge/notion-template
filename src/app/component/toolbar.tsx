"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LucideIcon,
  MagnetIcon,
  MessageSquareIcon,
  PenIcon,
  PlusIcon,
  SeparatorVertical,
  StickerIcon,
  StickyNoteIcon,
} from "lucide-react";
import { useEditor } from "@tiptap/react";
import { useEditorStore } from "../store/use-editor-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useAIAssistant } from "@/ai-extension/hooks/use-ai-hook";
import { stat } from "fs";

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

const AIagentComponent = () => {
  const { editor } = useEditorStore();
  const { generateContent, ...state } = useAIAssistant({editor:editor! })
  const [isOpen, setIsOpen] = React.useState(state.isProcessing);
  const [input, setInput] = useState("");


  const handleGenerate = async (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('handle click')

    await generateContent(input.trim()).finally(()=>{
      setIsOpen(false)
          setInput("");
})
    
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="hover:bg-neutral-300">
          <MessageSquareIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write your thoughts here.. </DialogTitle>
        </DialogHeader>
        <Input className="w-full border-1   truncate focus-visible:border-none focus-visible:outline-0 outline-none px-1.5"
        placeholder="Tell us a dad joke! , write a story..." 
        value={input}
        onChange={(e)=>setInput(e.target.value)}/>
        <DialogFooter className="flex justify-end item-center">
          <div className="flex item-center justify-center">
            <Button onClick={(e) => handleGenerate(e)}>
              <PenIcon className="size-4" />
              Generate
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
