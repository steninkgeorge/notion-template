import { useEditorStore } from "@/app/store/use-editor-store";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToolbarItemType } from "@/types";
import { ChevronDown, Heading1Icon, Heading2Icon, Heading3Icon, List, ListCheck, ListOrderedIcon, PilcrowIcon } from "lucide-react";
import { useState } from "react";

export const Heirarchy =()=>{
      const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<undefined | string>(undefined);
const {editor }=  useEditorStore()


 const textFormatting: ToolbarItemType[] = [
   [
     {
       label: "Paragraph",
       icon: PilcrowIcon,
       onClick: () => editor?.chain().focus().setNode("paragraph").run(),
       isActive: editor?.isActive("paragraph") ?? false,
     },
     {
       label: "Heading 1",
       icon: Heading1Icon,
       onClick: () =>
         editor?.chain().focus().setNode("heading", { level: 1 }).run(),

       isActive: editor?.isActive("heading") ?? false,
     },
     {
       label: "Heading 2",
       icon: Heading2Icon,
       onClick: () =>
         editor?.chain().focus().setNode("heading", { level: 1 }).run(),

       isActive: editor?.isActive("heading") ?? false,
     },
     {
       label: "Heading 3",
       icon: Heading3Icon,
       onClick: () =>
         editor?.chain().focus().setNode("heading", { level: 1 }).run(),

       isActive: editor?.isActive("heading") ?? false,
     },
   ],
   [
     {
       label: "Ordered List",
       icon: ListOrderedIcon,
       onClick: () => editor?.chain().focus().toggleOrderedList().run(),

       isActive: editor?.isActive("orderedList") ?? false,
     },
     {
       label: "Bullet list",
       icon: List,
       onClick: () => editor?.chain().focus().toggleBulletList().run(),

       isActive: editor?.isActive("bulletList") ?? false,
     },
     {
       label: "Todo list",
       icon: ListCheck,
       onClick: () => editor?.chain().focus().toggleTaskList().run(),

       isActive: editor?.isActive("taskList") ?? false,
     },
   ],
 ];


    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className=" min-w-[60px] justify-evenly bg-neutral-50"
          >
            <div className="truncate">
              {" "}
              {selected || <PilcrowIcon className="size-4" />}
            </div>
            <ChevronDown className="size-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-1 shadow ">
          <div className="flex flex-col text-sm space-y-4 p-1">
            <div>
              <p className="text-muted-foreground  font-medium mb-2">
                Hierarchy
              </p>
              <div className="flex flex-col space-y-1 ">
                {textFormatting[0].map(({ icon: Icon, ...item }) => (
                  <div
                    key={item.label}
                    onClick={item.onClick}
                    className="flex items-center gap-x-1 px-2 py-1 hover:bg-muted rounded-md cursor-pointer transition-colors"
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-muted-foreground font-medium mb-2">List</p>
              <div className="flex flex-col space-y-1">
                {textFormatting[1].map(({ icon: Icon, ...item }) => (
                  <div
                    key={item.label}
                    onClick={item.onClick}
                    className="flex items-center gap-x-1 px-2 py-1 hover:bg-muted rounded-md cursor-pointer transition-colors"
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
}