'use client';

import Editor from './component/editor';
import { SuggestionPanel } from '../tiptap-extensions/ai-suggestion/suggestion/suggestion-panel';
import { SuggestionPanelItems } from '../tiptap-extensions/ai-suggestion/suggestion/suggestion-panel-item';
import { Toolbar } from './component/toolbar';
import { TocOverlay } from '@/app/component/table-of-content';
import { useState, useEffect } from 'react';

export default function Home() {
  // Check for system preference or saved preference
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  console.log(theme);
  useEffect(() => {
    // Get the current theme from localStorage or system preference
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen ">
      <div className="toolbar-container w-full ">
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
