import { Editor, Extension } from "@tiptap/core";
import { Suggestion } from "@tiptap/suggestion";
import { CommandProps } from "@/types/command";
import {createRoot, Root} from "react-dom/client";
import {CommandMenu} from "@/app/component/command-menu";
import React from "react";
import { title } from "process";
/*TODO: add AI generative features
//TODO: AI tools-> simplify , emojify, make shorter , make longer,
 fix spelling and grammar, translate, complete sentence, change tone*/
 //TODO: insert -> table , column , horizontal rule , image and table of contents 
 //TODO format : heading, bullet , number , task , toggle list
//TODO: link transformation, add link option , more options 



const CommandsPlugin = Extension.create({
  name: "insertMenu",

  addProseMirrorPlugins() {
    return [
      Suggestion<CommandProps>({
        editor: this.editor,
        char: "/",
        command: ({ editor, range, props }) => {
              editor.chain().focus().deleteRange(range).run();

          props.command({ editor, range, props });
        },
        items: ({ query }) => {
          return [
            //ai options
            {
              title: "AI tools",
              command: ({ editor }: { editor: Editor }) =>
                editor
                  .chain()
                  .focus()
                  .insertPromptBox({ initialPrompt: "" }) 
                  .run(),
            },

            //text formatting
            {
              title: "Heading",
              command: ({ editor }: { editor: Editor }) =>
                editor.chain().focus().setNode("heading", { level: 1 }).run(),
            },
            {
              title: "Subheading",
              command: ({ editor }: { editor: Editor }) =>
                editor.chain().focus().setNode("heading", { level: 2 }).run(),
            },
            {
              title: "Quote",
              command: ({ editor }: { editor: Editor }) =>
                editor.chain().focus().setBlockquote().run(),
            },
            {
              title: "Bullet List",
              command: ({ editor }: { editor: Editor }) =>
                editor.chain().focus().toggleBulletList().run(),
            },
            {
              title: "Numbered List",
              command: ({ editor }: { editor: Editor }) =>
                editor.chain().focus().toggleOrderedList().run(),
            },
            {
              title: "Code Block",
              command: ({ editor }: { editor: Editor }) =>
                editor.chain().focus().setCodeBlock().run(),
            },
            //insert options
            //table
            //image -> custom node
            //column -> custom node (maybe)
            //horizontal rule
          ]
            .filter((item) =>
              item.title.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 5);
        },
        startOfLine: true,
        allow: ({ state, range, editor }) => {
          const node = state.selection.$from.node();
          if (!node) return false;
          return node.textBetween(0, 1) === "/";
        },
        render: () => {
         let rootElement: HTMLElement | null = null;
         let root: Root | null = null;

          return {
            onStart: (props) => {
              rootElement = document.createElement("div");
              document.body.appendChild(rootElement);
              root = createRoot(rootElement);

              root.render(
                React.createElement(CommandMenu, {
                  ...props,
                  title:title,
                  items: props.items,
                  command: props.command,
                  clientRect: props.clientRect,
                })
              );
            },
            onUpdate: (props) => {
              if (root && rootElement) {
                React.createElement(CommandMenu, {
                  ...props,
                  title:title,
                  items: props.items,
                  command: props.command,
                  clientRect: props.clientRect,
                });
              }
            },
            
            onExit: () => {
              // Clean up
              if (root) {
                root.unmount();
              }
              if (rootElement && rootElement.parentNode) {
                rootElement.parentNode.removeChild(rootElement);
              }
            },
          };
        },
      }),
    ];
  },
});

export default CommandsPlugin;
