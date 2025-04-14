import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { AiSuggestion } from '../extensions/ai-suggestion';
import { AiSuggestionSidebar } from './AiSuggestionSidebar';

const initialRules = [
  {
    id: '1',
    title: 'Spell Check',
    prompt: 'Identify and correct any spelling mistakes',
    color: '#DC143C',
    backgroundColor: '#FFE6E6',
  },
];

export const EditorWithAiSuggestions: React.FC = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      AiSuggestion.configure({
        loadOnStart: false,
        debounceTimeout: 1000,
        reloadOnUpdate: false,
        rules: initialRules,
      }),
    ],
    content: '<p>Hello World!</p>',
  });

  useEffect(() => {
    if (editor) {
      // Load suggestions when the editor is ready
      editor.commands.loadAiSuggestions();
    }
  }, [editor]);

  const handleUpdateRules = (newRules: typeof initialRules) => {
    if (editor) {
      editor.chain().setAiSuggestionRules(newRules).loadAiSuggestions().run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-4">
        <EditorContent editor={editor} />
      </div>
      <AiSuggestionSidebar editor={editor} />
    </div>
  );
};
