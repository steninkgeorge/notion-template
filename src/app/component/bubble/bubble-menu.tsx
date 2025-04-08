import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ToolbarButtonProps, ToolbarItemType } from "@/types";
import { BubbleMenu, Editor } from "@tiptap/react"
import { BoldIcon, ItalicIcon, LucideIcon, Strikethrough, Underline } from "lucide-react";
import { AItools } from "./ai-tool";
import { Separator } from "@/components/ui/separator";
import { Heirarchy } from "./text-formatting";
import { FontFamilyButton } from "./font-selection";
import { FontSizeOptionButton } from "./text-size";
import { MoreOptions } from "./more-options";

/* 1. heading , paragraph , lists
2.fonts
3.size 
BIUS code , codeblock , setlink. highlight , color 
More options -> superscript , subscript and alignment*/

const BubbleMenuButton = ({
  label,
  icon: Icon,
  onClick,
  isActive,
}: ToolbarButtonProps) => {
  return (
    <div className="relative group ">
      <Button
        size={"icon"}
        variant={"ghost"}
        className={cn(
          "hover:bg-neutral-100 p-1 m-0.5",
          isActive && "bg-neutral-100"
        )}
        onClick={onClick}
      >
        <Icon className="size-3" />
      </Button>
      <div>
        <span className="absolute top-full mt-0.5 p-0.5 font-semibold   text-xs z-[10] bg-black px-1.5 text-neutral-300 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
          {label}
        </span>
      </div>
    </div>
  );
};


export const TextBubbleMenu=({editor}:{editor:Editor | null})=>{
    if(!editor) return null

    const item: ToolbarItemType = [
      {
        label: "Bold",
        icon: BoldIcon,
        onClick: () => editor.chain().focus().toggleBold().run(),
        isActive: editor.isActive("bold"),
      },
      {
        label: "Italic",
        icon: ItalicIcon,
        onClick: () => editor.chain().focus().toggleItalic().run(),
        isActive: editor.isActive("italic"),
      },
      {
        label: "Underline",
        icon: Underline,
        onClick: () => editor.chain().focus().toggleUnderline().run(),
        isActive: editor.isActive("underline"),
      },
      {
        label: "Strike",
        icon: Strikethrough,
        onClick: () => editor.chain().focus().toggleStrike().run(),
        isActive: editor.isActive('strike'),
      },

      //TODO: add color picker , highlight 
      
    ];

    return (
      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 100 }}
        className="flex flex-row items-center bg-white rounded-md border px-0.5 gap-1 w-fit"
      >
        <AItools editor={editor} />
        <Separator orientation="vertical" />
        <Heirarchy />
        <FontFamilyButton />
        <FontSizeOptionButton/>
        {item.map((item, index) => (
          <BubbleMenuButton
            key={index}
            label={item.label}
            icon={item.icon}
            onClick={item.onClick}
            isActive={item.isActive}
          />
        ))}
        <MoreOptions/>
      </BubbleMenu>

    );
}