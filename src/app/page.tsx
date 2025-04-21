'use client';

import Editor from './component/editor';
import { SuggestionPanel } from '../tiptap-extensions/ai-suggestion/suggestion/suggestion-panel';
import { SuggestionPanelItems } from '../tiptap-extensions/ai-suggestion/suggestion/suggestion-panel-item';
import { Toolbar } from './component/toolbar';
import { useState } from 'react';

export default function Home() {
  const [showPanel, setShowPanel] = useState<boolean>(false);
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="toolbar-container w-full">
        <Toolbar showPanel={showPanel} setShowPanel={setShowPanel} />
      </div>
      <div className="flex relative w-full">
        <div className="editor-container flex-grow ">
          <Editor />
        </div>

        {/* Remove the wrapper div around SuggestionPanel */}
        {showPanel && (
          <SuggestionPanel
            title="Suggestions"
            showPanel={showPanel}
            setShowPanel={setShowPanel}
          >
            <SuggestionPanelItems />
          </SuggestionPanel>
        )}
      </div>
    </div>
  );
}
