import { Editor } from "@tiptap/react";

export interface CommandProps {
  title: string;
  command: ({ editor }: { editor: Editor }) => void;
}
