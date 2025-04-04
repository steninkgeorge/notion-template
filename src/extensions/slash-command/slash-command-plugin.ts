import { Editor, Extension } from "@tiptap/core";
import { Suggestion } from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import tippy, { Instance } from "tippy.js";
import { CommandProps } from "@/types/command";

import CommandsView from "@/app/component/command-menu";

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
          let component: ReactRenderer<CommandsView, any>;
          let popup: Instance<any>;

          return {
            onStart: (props) => {
              component = new ReactRenderer(CommandsView, {
                props,
                editor: props.editor,
              });
              popup = tippy(props.editor.options.element, {
                getReferenceClientRect: () =>
                  props.clientRect?.() || new DOMRect(),
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
              });
            },
            onUpdate: (props) => {
              component.updateProps(props);
              popup.setProps({ getReferenceClientRect: props.clientRect });
            },
            onKeyDown: ({ event }) => {
              if (event.key === "Escape") {
                popup.hide();
                return true;
              }
              return component.ref?.onKeyDown(event as KeyboardEvent) ?? false;
            },
            onExit: () => {
              component.destroy();
              popup.destroy();
            },
          };
        },
      }),
    ];
  },
});

export default CommandsPlugin;
