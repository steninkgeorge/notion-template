"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {  BotIcon, LucideIcon, PlusIcon } from "lucide-react";
import { useEditorStore } from "../store/use-editor-store";
import React, { useState } from "react";
import {  AIGenerateToolbarComponent } from "./ai-generate";
import { ToolbarButtonProps, ToolbarItemType } from "@/types";


const ToolBarButton = ({
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
          "hover:bg-neutral-300 p-1 m-1 ",
          isActive && "bg-neutral-300"
        )}
        onClick={onClick}
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



export const Toolbar = () => {
    const { editor } = useEditorStore();

  const ToolbarItem: ToolbarItemType = [
    {
      label: "New Block",
      icon: PlusIcon,
      onClick: () => {},
      isActive: false,
    },

    {
      label: "AI Block",
      icon: BotIcon,
      onClick: () => {
        editor
          ?.chain()
          .focus()
          .insertContent({
            type: "AIgenerativenode",
            attrs: {
              initialPrompt: "",
            },
          })
          .run();
      }, // will be set later
      isActive: false,
    },
  ];
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
    </div>
  );
};
