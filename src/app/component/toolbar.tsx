'use client'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LucideIcon, PlusIcon } from "lucide-react"
import { useEditor } from "@tiptap/react";
import { useEditorStore } from "../store/use-editor-store";

interface ToolbarButtonProps{
    label:string 
    icon:LucideIcon,
    onClick:()=>void,
    isActive : boolean
}

type ToolbarItemType = {
    label:string,
    icon:LucideIcon,
    onClick:()=>void,
    isActive : boolean
}[]

const ToolBarButton = ({label , icon:Icon , onClick , isActive}: ToolbarButtonProps)=>{
    const {editor } = useEditorStore()
    return (
      <div className="relative group ">
        <Button
          size={"icon"}
          className={cn(
            "hover:bg-neutral-300 p-1 m-1 ",
            isActive && "bg-neutral-300"
          )}
          onClick={()=>{editor?.chain()
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
            .run();}}
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
}

const ToolbarItem : ToolbarItemType = [
    {
        label:'New Block',
        icon:PlusIcon,
        onClick:()=>{},
        isActive:false
    }
]

export const Toolbar=()=>{
    return (
        <div className="w-full max-w-[816px] bg-gray-200 mx-auto p-2 mt-10 rounded-sm">
            {ToolbarItem.map((item , index)=>(
                <ToolBarButton key={item.label} label={item.label} icon={item.icon} isActive={item.isActive} onClick={item.onClick}/>
            ))}
        </div>
    )
}