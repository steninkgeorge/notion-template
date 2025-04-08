import { useEditorStore } from "@/app/store/use-editor-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export const FontSizeOptionButton = () => {
  const { editor } = useEditorStore();

  const [open, setOpen] = useState(false);
  const fontSize = [
    { label: "Extra small", fontSize: "10px" },
    { label: "Small", fontSize: "12px" },
    { label: "Medium", fontSize: "16px" },
    { label: "Large", fontSize: "24px" },
    { label: "Extra Large", fontSize: "28px" },
    { label: "2xl", fontSize: "32px" },
  ];

  const currentFontSize = editor?.getAttributes("textStyle")?.fontSize;
  const currentFontLabel = fontSize.find((item)=> item.fontSize=== currentFontSize)?.label || ''


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className=" min-w-[60px] justify-evenly bg-neutral-50"
        >
          <div className="truncate">{currentFontLabel}</div>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-1 shadow bg-white  ">
        <div className="flex flex-col space-y-1 ">
          {fontSize.map((item) => (
            <div
              key={item.label}
              onClick={() =>
                editor?.chain().focus().setFontSize(item.fontSize).run()
              }
              style={{
                fontSize: item.fontSize,
                marginTop:0
              }}
              className={cn(
                "px-2 py-1 hover:bg-neutral-100 rounded-md cursor-pointer transition-colors",
                editor?.isActive("textStyle", {
                  fontFamily: `${item}`,
                }) && "bg-neutral-100"
              )}
            >
              {item.label}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
