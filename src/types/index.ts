import { LucideIcon } from "lucide-react";


export  interface ToolbarButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive: boolean;
}

export type ToolbarItemType = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive: boolean;
}[];
