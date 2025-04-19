import { Editor } from '@tiptap/react';
import { AiSuggestionPopover } from './ai-suggestion-popover';
import { useState, useEffect } from 'react';
import { AiSuggestionPluginKey } from '@/extensions/ai-suggestion/ai-suggestion';

export const AiSuggestionPopoverWrapper = ({ editor }: { editor: Editor }) => {
  const suggestions = editor.storage.aiSuggestion.suggestions || [];
  const selectedSuggestionId = editor.storage.aiSuggestion.selectedSuggestionId;
  const rules = editor.storage.aiSuggestion.rules || [];

  const selectedSuggestion = suggestions.find(
    (s: any) => s.id === selectedSuggestionId
  );

  if (!selectedSuggestion) return null;

  const rule = rules.find((r: any) => r.id === selectedSuggestion.ruleId);
  if (!rule) return null;

  const handleApply = (replacementOptionId: string) => {
    console.log('apply');
    editor.commands.applyAiSuggestion({
      suggestionId: selectedSuggestion.id,
      replacementOptionId,
    });

    editor.view.dispatch(editor.state.tr.setMeta('updateDecorations', true));
  };

  const handleReject = () => {
    editor.storage.aiSuggestion.suggestions = suggestions.filter(
      (s: any) => s.id !== selectedSuggestion.id
    );
    // Trigger decoration update
    editor.view.dispatch(
      editor.state.tr.setMeta(AiSuggestionPluginKey, { updated: true })
    );
  };

  const findAdjacentSuggestion = (direction: 'prev' | 'next') => {
    const currentIndex = suggestions.findIndex(
      (s: any) => s.id === selectedSuggestionId
    );
    if (currentIndex === -1) return;

    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < suggestions.length) {
      editor.storage.aiSuggestion.selectedSuggestionId =
        suggestions[newIndex].id;
    }
  };

  return (
    <AiSuggestionPopover
      editor={editor}
      suggestion={selectedSuggestion}
      rule={rule}
      onApply={handleApply}
      onReject={handleReject}
      onPrevious={() => findAdjacentSuggestion('prev')}
      onNext={() => findAdjacentSuggestion('next')}
    />
  );
};
