
[![npm version](https://img.shields.io/npm/v/notion-editor-template)](https://www.npmjs.com/package/notion-editor-template)
[![npm downloads](https://img.shields.io/npm/dm/notion-editor-template)](https://www.npmjs.com/package/notion-editor-template)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

# Customize your notion like editor with this template!
<video src="https://github.com/user-attachments/assets/709b2112-cea1-43c3-94e2-52ff2456dd26" controls width="600">
  Your browser does not support the video tag.
</video>
## Installation

```bash
# npm
npm install notion-editor-template
```

## To run the editor locally 

- clone this repo
- open the terminal and run `npm run dev`

## Quick Start

```jsx
import React from 'react';
import { TemplateEditor, useTemplateEditor } from '@your-org/template-editor';

const MyEditor = () => {
  // Initialize the editor with optional initial content
  const editor = useTemplateEditor('Hello World!');

  return (
    <div className="editor-container">
      <TemplateEditor editor={editor} />
    </div>
  );
};

export default MyEditor;
```

## Adding AI Suggestions Extension

To add the AI Suggestions extension to your editor:

```jsx
import React from 'react';
import { TemplateEditor, useTemplateEditor } from '@your-org/template-editor';
import { AiSuggestion } from '@your-org/template-editor/extensions';

const EditorWithAI = () => {
  const editor = useTemplateEditor('', {
    extensions: [
      // Other extensions...
      AiSuggestion.configure({
        rules: [
          {
            id: 'grammar',
            title: 'Grammar',
            prompt: 'Fix grammar errors',
            color: '#4285F4',
            backgroundColor: '#E8F0FE',
          },
        ],
        loadOnStart: true,
        reloadOnUpdate: true,
        debounceTimeout: 5000,
      }),
    ],
  });

  return (
    <div className="editor-container">
      <TemplateEditor editor={editor} />
    </div>
  );
};
```

For detailed documentation on the AI Suggestions extension, please see [AI_SUGGESTIONS.md](./AI_SUGGESTIONS.md).

## Provide Props

### Custom Configuration

```jsx
import React from 'react';
import { TemplateEditor, useTemplateEditor } from '@your-org/template-editor';

const AdvancedEditor = () => {
  const editor = useTemplateEditor('', {
    // Add custom event handlers
    onUpdate: ({ editor }) => {
      console.log('Content updated:', editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      console.log('Selection changed');
    },

    // Customize editor appearance
    editorProps: {
      attributes: {
        class: 'custom-editor-class p-6 min-h-[500px] rounded-lg shadow',
      },
    },
  });

  return (
    <div className="advanced-editor-container">
      <TemplateEditor editor={editor} />
    </div>
  );
};
```

## ⚙️ API Reference

### useTemplateEditor

```typescript
function useTemplateEditor(
  content?: string,
  options?: Partial<EditorOptions>
): Editor | null;
```

#### Parameters

- `content` (optional): Initial editor content as HTML or plain text
- `options` (optional): TipTap editor options

#### Returns

An Editor instance or null if not initialized

### TemplateEditor

```typescript
interface TemplateEditorProps {
  editor: Editor | null;
}

function TemplateEditor({ editor }: TemplateEditorProps): JSX.Element;
```

#### Parameters

- `editor`: Editor instance created with useTemplateEditor

## 🧩 Extensions

This editor comes with the following extensions pre-configured:

- Basic formatting (StarterKit)
- Draggable blocks
- Slash commands
- Task lists
- Text styling (color, font family, font size)
- Superscript and subscript
- Text alignment
- AI assistant capabilities
- Markdown support
- AI suggestions for content improvements

## 🔄 Updating from npm

When a new version is released, update the package using:

```bash
npm update notion-editor-template
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## ✨ Features

- 📝 Rich text editing with Notion-like interface
- 🤖 AI-powered content assistance
- 🧩 Draggable blocks for easy content reorganization
- ⚡ Slash commands for quick actions
- ✅ Task lists and checklists
- 📊 Text formatting options (underline, colors, alignment, etc.)
- 📱 Responsive design
- 🔗 Markdown import/export
- 🪄 AI suggestions for content improvement

## 📄 License

MIT
