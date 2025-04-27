'use client';

import Editor from './component/editor';
import { SuggestionPanel } from '../tiptap-extensions/ai-suggestion/suggestion/suggestion-panel';
import { SuggestionPanelItems } from '../tiptap-extensions/ai-suggestion/suggestion/suggestion-panel-item';
import { Toolbar } from './component/toolbar';
import { TocOverlay } from '@/tiptap-extensions/heading/table-of-content';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="toolbar-container w-full">
        <Toolbar />
      </div>
      <div className="flex relative w-full">
        <div className="editor-container flex-grow ">
          <Editor />
        </div>
        <div className="fixed left-4 top-34 flex flex-col w-64">
          <TocOverlay />
        </div>
        <SuggestionPanel title="Suggestions">
          <SuggestionPanelItems />
        </SuggestionPanel>
      </div>
    </div>
  );
}
