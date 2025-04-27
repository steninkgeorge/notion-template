'use client';
import { Button } from '@/components/ui/button';
import { RulesCardComponent } from './rules-card-component';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ManageRules } from './manage-rules';
import { useEditorStore } from '@/app/store/use-editor-store';
import { Suggestion } from '../types';
import { memo } from 'react';
import { AiSuggestionPluginKey } from '..';

interface Rule {
  id: string;
  title: string;
  prompt: string;
  color: string;
  backgroundColor: string;
}

const MemoizedRulesCardComponent = memo(RulesCardComponent);

export const SuggestionPanelItems = () => {
  const [open, setOpen] = useState(false);
  const { editor } = useEditorStore();
  const [rules, setRules] = useState<Rule[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const getRulesFromEditor = useCallback(() => {
    if (!editor) return;

    // Get rules from editor storage
    const storage = editor.storage.aiSuggestion;

    if (storage && storage.rules) {
      setRules(storage.rules);
    }
  }, [setRules]);

  const handleApplyAllSuggestions = () => {
    // Access the plugin instance directly
    const editorView = editor?.view;

    if (!editorView) return;

    // Get all suggestions
    const allSuggestions = [...editor.storage.aiSuggestion.suggestions];
    if (allSuggestions.length === 0) return;

    // Sort from back to front
    allSuggestions.sort((a, b) => b.deleteRange.from - a.deleteRange.from);

    // Create a transaction
    let tr = editorView.state.tr;

    // Apply all replacements in one go
    for (const suggestion of allSuggestions) {
      if (!suggestion.replacementOptions?.length) continue;

      const option = suggestion.replacementOptions[0];
      tr = tr.insertText(
        option.addText,
        suggestion.deleteRange.from,
        suggestion.deleteRange.to
      );
    }

    // Apply the transaction directly
    if (tr.steps.length > 0) {
      editorView.dispatch(tr);

      // Clear suggestions
      editor.storage.aiSuggestion.suggestions = [];

      // Update UI
      editorView.dispatch(
        editorView.state.tr.setMeta(AiSuggestionPluginKey, {
          updated: true,
        })
      );
      editorView.dispatch(
        editorView.state.tr.setMeta('aiSuggestionsUpdate', [])
      );
    }
  };

  useEffect(() => {
    getRulesFromEditor();
  }, []);

  const getSuggestionsFromEditor = useCallback(() => {
    if (!editor) return;

    // Get rules from editor storage
    const storage = editor.storage.aiSuggestion;

    if (storage?.suggestions) {
      setSuggestions(storage.suggestions);
    }
  }, [setSuggestions]);

  useMemo(() => {
    if (!editor) return null;

    const onTransaction = ({ transaction }: { transaction: any }) => {
      if (transaction.getMeta('aiSuggestionRulesUpdated')) {
        getRulesFromEditor();
      }
      if (transaction.getMeta('aiSuggestionsUpdate')) {
        getSuggestionsFromEditor();
      }
    };
    editor.on('transaction', onTransaction);

    return () => {
      editor.off('transaction', onTransaction);
    };
  }, []);

  return (
    <div className="flex flex-col">
      <MemoizedRulesCardComponent rules={rules} suggestions={suggestions} />
      {/* Buttons */}
      <div className="flex space-x-2 pt-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setOpen(true)}
        >
          Manage Rules
        </Button>
        <Button className="flex-1" onClick={handleApplyAllSuggestions}>
          Accept All
        </Button>
      </div>

      <ManageRules open={open} setOpen={setOpen} rules={rules} />
    </div>
  );
};
