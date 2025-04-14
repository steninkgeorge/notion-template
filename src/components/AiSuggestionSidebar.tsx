import React from 'react';
import { Editor } from '@tiptap/core';

interface AiSuggestionSidebarProps {
  editor: Editor;
}

export const AiSuggestionSidebar: React.FC<AiSuggestionSidebarProps> = ({
  editor,
}) => {
  const storage = editor.extensionStorage.aiSuggestion;
  const suggestions = storage.getSuggestions();

  const handleApplySuggestion = (
    suggestionId: string,
    replacementOptionId: string
  ) => {
    editor
      .chain()
      .applyAiSuggestion({
        suggestionId,
        replacementOptionId,
      })
      .command(({ tr, commands }) => {
        const suggestion = suggestions.find((s) => s.id === suggestionId);
        if (!suggestion) return false;

        return commands.setTextSelection({
          from: tr.mapping.map(suggestion.deleteRange.from),
          to: tr.mapping.map(suggestion.deleteRange.to),
        });
      })
      .setBold()
      .command(({ tr, commands }) => {
        const suggestion = suggestions.find((s) => s.id === suggestionId);
        if (!suggestion) return false;

        return commands.setTextSelection(
          tr.mapping.map(suggestion.deleteRange.to)
        );
      })
      .focus()
      .run();
  };

  return (
    <div className="w-80 h-full overflow-y-auto p-4 border-l border-gray-200">
      <h2 className="text-lg font-semibold mb-4">AI Suggestions</h2>
      {suggestions.length === 0 ? (
        <p className="text-gray-500">No suggestions available</p>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion) => {
            const rule = storage.rules.find((r) => r.id === suggestion.ruleId);
            return (
              <div
                key={suggestion.id}
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: rule?.backgroundColor,
                  border: `1px solid ${rule?.color}`,
                }}
              >
                <h3 className="font-medium mb-2" style={{ color: rule?.color }}>
                  {rule?.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Original: {suggestion.deleteText}
                </p>
                <div className="space-y-2">
                  {suggestion.replacementOptions.map((option) => (
                    <button
                      key={option.id}
                      className="w-full p-2 text-left rounded hover:bg-gray-100"
                      onClick={() =>
                        handleApplySuggestion(suggestion.id, option.id)
                      }
                    >
                      <span className="font-medium">Suggestion:</span>{' '}
                      {option.addText}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
