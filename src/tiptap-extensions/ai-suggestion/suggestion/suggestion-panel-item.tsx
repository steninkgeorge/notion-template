'use client';
import { Button } from '@/components/ui/button';
import { RulesCardComponent } from './rules-card-component';
import { useEffect, useState } from 'react';
import { ManageRules } from './manage-rules';
import { useEditorStore } from '@/app/store/use-editor-store';

interface Rule {
  id: string;
  title: string;
  prompt: string;
  color: string;
  backgroundColor: string;
}

export const SuggestionPanelItems = ({
  setDialogOpen,
}: {
  setDialogOpen?: (isOpen: boolean) => void;
}) => {
  const [open, setOpen] = useState(false);
  const { editor } = useEditorStore();
  const [rules, setRules] = useState<Rule[]>([]);

  // Update parent component when dialog state changes
  useEffect(() => {
    if (setDialogOpen) {
      setDialogOpen(open);
    }
  }, [open, setDialogOpen]);

  useEffect(() => {
    if (!editor) return;

    // Get rules from editor storage
    const getRulesFromEditor = () => {
      const storage = editor.storage.aiSuggestion;
      if (storage && storage.rules) {
        setRules(storage.rules);
      }
    };

    // Initial fetch
    getRulesFromEditor();

    const onTransaction = ({ transaction }: { transaction: any }) => {
      if (transaction.getMeta('aiSuggestionRulesUpdated')) {
        getRulesFromEditor();
      }
    };
    editor.on('transaction', onTransaction);

    return () => {
      editor.off('transaction', onTransaction);
    };
  }, [editor]);

  return (
    <div className="flex flex-col">
      <RulesCardComponent rules={rules} />
      {/* Buttons */}
      <div className="flex space-x-2 pt-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setOpen(true)}
        >
          Manage Rules
        </Button>
        <Button className="flex-1" onClick={() => {}}>
          Accept All
        </Button>
      </div>

      <ManageRules open={open} setOpen={setOpen} rules={rules} />
    </div>
  );
};
