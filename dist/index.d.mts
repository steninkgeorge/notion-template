import * as react from 'react';
import { Editor, EditorOptions } from '@tiptap/react';

interface TemplateEditorProps {
    editor: Editor | null;
}
declare const TemplateEditor: ({ editor }: TemplateEditorProps) => react.JSX.Element;

declare const useTemplateEditor: (content?: string, options?: Partial<EditorOptions>) => Editor | null;

export { TemplateEditor, useTemplateEditor };
