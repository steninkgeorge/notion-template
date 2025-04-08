import { useEditorStore } from "@/app/store/use-editor-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { textFormatting } from "@/types/constant";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { PilcrowIcon, ChevronDown } from "lucide-react";
import { useState } from "react";

export const FontFamilyButton = () => {
  const { editor } = useEditorStore();
 const [open, setOpen] = useState(false);
 const [selected, setSelected] = useState<undefined | string>(undefined);

  const fonts = [
    { label: "Arial", value: "Arial" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Courier New", value: "Courier New" },
    { label: "Georgia", value: "Georgia" },
    { label: "Verdana", value: "Verdana" },
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
            {editor?.getAttributes("textStyle").fontFamily || "Arial"}
          </div>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-1 shadow bg-white  ">
        <div className="flex flex-col space-y-1 ">
          {fonts.map((item) => (
            <div
              key={item.label}
              onClick={() =>
                editor?.chain().focus().setFontFamily(`${item.value}`).run()
              }
              style={{
                fontFamily: item.value,
              }}
              className={cn(
                "px-2 py-1 hover:bg-neutral-100 rounded-md cursor-pointer transition-colors",
                editor?.isActive("textStyle", { fontFamily: `${item.value}` }) && 'bg-neutral-100'
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
