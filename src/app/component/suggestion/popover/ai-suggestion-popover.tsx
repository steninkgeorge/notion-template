import { useState, useEffect, useRef } from 'react';
import { Editor, useEditor } from '@tiptap/react';
import { createPortal } from 'react-dom';
import suggestion from '@tiptap/suggestion';
import { Popover, PopoverContent } from '@/components/ui/popover';

interface AiSuggestionPopoverProps {
  editor: Editor;
  suggestion: {
    id: string;
    ruleId: string;
    deleteText: string;
    deleteRange: { from: number; to: number };
    replacementOptions: { id: string; addText: string }[];
  };
  rule: {
    id: string;
    title: string;
    prompt: string;
    color: string;
    backgroundColor: string;
  };
  onApply: (replacementOptionId: string) => void;
  onReject: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

export const AiSuggestionPopover = ({
  editor,
  suggestion,
  rule,
  onApply,
  onReject,
  onPrevious,
  onNext,
}: AiSuggestionPopoverProps) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;

    const updatePosition = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [editor, suggestion]);

  if (!suggestion || !editor?.storage.aiSuggestion.selectedSuggestionId) {
    return null;
  }

  // Get the first replacement option (as requested)
  const firstReplacement = suggestion.replacementOptions[0];

  const selectedSuggestion =
    editor.storage.aiSuggestion.getSelectedSuggestion();
  if (!selectedSuggestion) return null;

  return createPortal(
    <div
      ref={popoverRef}
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 50,
        backgroundColor: 'white',
        borderRadius: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '12px',
        minWidth: '250px',
        maxWidth: '350px',
      }}
    >
      {/* Navigation buttons (top right) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
          marginBottom: '8px',
        }}
      >
        {onPrevious && (
          <button
            onClick={onPrevious}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#666',
              fontSize: '12px',
              padding: '2px 6px',
            }}
          >
            &larr;
          </button>
        )}
        {onNext && (
          <button
            onClick={onNext}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#666',
              fontSize: '12px',
              padding: '2px 6px',
            }}
          >
            &rarr;
          </button>
        )}
      </div>

      {/* Suggested replacement (highlighted) */}
      <div
        style={{
          padding: '8px',
          backgroundColor: rule.backgroundColor,
          borderRadius: '4px',
          marginBottom: '12px',
        }}
      >
        {firstReplacement.addText}
      </div>

      {/* Action buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
          marginBottom: '8px',
        }}
      >
        <button
          onClick={onReject}
          style={{
            padding: '4px 12px',
            background: 'none',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Reject
        </button>
        <button
          onClick={() => onApply(firstReplacement.id)}
          style={{
            padding: '4px 12px',
            background: rule.color,
            color: rule.backgroundColor,
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Apply
        </button>
      </div>

      {/* Rule info (subtle) */}
      <div
        style={{
          fontSize: '11px',
          color: '#888',
          paddingTop: '8px',
          borderTop: '1px solid #eee',
        }}
      >
        {rule.title}: {rule.prompt}
      </div>
    </div>,
    document.body
  );
};
