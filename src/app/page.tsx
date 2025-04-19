'use client';

import Editor from './component/editor';
import { SuggestionPanel } from '../tiptap-extensions/ai-suggestion/suggestion/suggestion-panel';
import { SuggestionPanelItems } from '../tiptap-extensions/ai-suggestion/suggestion/suggestion-panel-item';
import { Toolbar } from './component/toolbar';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="toolbar-container w-full">
        <Toolbar />
      </div>
      <div className="flex relative w-full">
        <div className="editor-container flex-grow">
          <Editor />
        </div>

        {/* Remove the wrapper div around SuggestionPanel */}
        <SuggestionPanel title="Suggestions">
          <SuggestionPanelItems />
        </SuggestionPanel>
      </div>
    </div>
  );
}
