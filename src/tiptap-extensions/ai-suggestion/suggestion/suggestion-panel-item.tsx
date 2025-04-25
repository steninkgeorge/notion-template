'use client';
import { Button } from '@/components/ui/button';
import { RulesCardComponent } from './rules-card-component';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ManageRules } from './manage-rules';
import { useEditorStore } from '@/app/store/use-editor-store';
import { Suggestion } from '../types';
import { memo } from 'react';

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
        <Button
          className="flex-1"
          onClick={() => {
            editor?.commands.applyAllAiSuggestions();
          }}
        >
          Accept All
        </Button>
      </div>

      <ManageRules open={open} setOpen={setOpen} rules={rules} />
    </div>
  );
};
