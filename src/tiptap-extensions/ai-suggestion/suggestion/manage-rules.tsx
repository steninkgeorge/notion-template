import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useEditorStore } from '@/app/store/use-editor-store';

import { AddNewRule } from './add-new-rule';
import { useState } from 'react';
import { PenIcon, Trash2Icon } from 'lucide-react';

interface Rule {
  id: string;
  title: string;
  prompt: string;
  color: string;
  backgroundColor: string;
}

interface ManageRulesProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  rules: Rule[];
}

export const ManageRules = ({ open, setOpen, rules }: ManageRulesProps) => {
  const { editor } = useEditorStore();
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  // Use stopPropagation to prevent dragging
  const stopPropagation = (
    e: React.MouseEvent | React.TouchEvent | React.PointerEvent
  ) => {
    e.stopPropagation();
  };

  const handleDelete = (ruleId: string) => {
    const newRules = rules.filter((value) => value.id !== ruleId);
    if (editor) {
      editor.commands.setAiSuggestionRules(newRules);
    }
  };

  const handleEdit = (rule: Rule) => {
    setEditingRule(rule);
  };

  const handleCancelEdit = () => {
    setEditingRule(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-2xl max-h-[80vh] flex flex-col"
        onMouseDown={stopPropagation}
        onTouchStart={stopPropagation}
        onPointerDown={stopPropagation}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Manage Rules
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="group relative rounded-lg border p-3 "
            >
              <div className="flex item-start gap-3 ">
                <div
                  className="w-3 h-3 rounded-xs mt-1 flex shrink-0"
                  style={{ backgroundColor: rule.color }}
                />
                <div className="flex-1 min-w-0 overflow-hidden">
                  <h3 className="font-medium text-sm truncate">{rule.title}</h3>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-snug break-words">
                    {rule.prompt}
                  </p>
                </div>

                <div className="gap-2 flex ">
                  <Button variant="ghost" onClick={() => handleEdit(rule)}>
                    <PenIcon className="size-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size={'icon'}
                    onClick={() => handleDelete(rule.id)}
                  >
                    <Trash2Icon className="size-3 text-red-400" />
                  </Button>
                </div>
              </div>
              {editingRule?.id === rule.id && (
                <div className="mt-1">
                  <AddNewRule
                    editor={editor}
                    rules={rules}
                    ruleToEdit={editingRule}
                    setOpen={setOpen}
                    isEditing={true}
                    onCancel={handleCancelEdit}
                  />
                </div>
              )}
            </div>
          ))}

          <AddNewRule editor={editor} rules={rules} setOpen={setOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
