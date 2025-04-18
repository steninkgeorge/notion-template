import { colorOptions } from '@/constants/color';
import { RuleFormData, ruleFormSchema } from '@/lib/rule-form-validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { rules } from '@/extensions/ai-suggestion/rules';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import editor from '../editor';
import { Editor } from '@tiptap/react';

interface Rule {
  id: string;
  title: string;
  prompt: string;
  color: string;
  backgroundColor: string;
}

interface AddNewRuleProps {
  isEditing?: boolean;
  editor: Editor | null;
  rules: Rule[];
  ruleToEdit?: Rule | null;
  setOpen: (open: boolean) => void;
  onCancel?: () => void;
}

export const AddNewRule = ({
  isEditing = false,
  editor,
  rules,
  setOpen,
  ruleToEdit = null,
  onCancel = () => {},
}: AddNewRuleProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RuleFormData>({
    resolver: zodResolver(ruleFormSchema),
    defaultValues: {
      title: ruleToEdit?.title || '',
      prompt: ruleToEdit?.prompt || '',
      color: ruleToEdit?.color || colorOptions[0].color,
      backgroundColor:
        ruleToEdit?.backgroundColor || colorOptions[0].backgroundColor,
    },
  });

  const currentColor = watch('color');

  const onSubmit = (formData: RuleFormData) => {
    // Generate a unique ID
    const newId = Date.now().toString();
    // Create a new rule with validated form data
    const newRule: Rule = {
      id: newId,
      title: formData.title,
      prompt: formData.prompt,
      color: formData.color,
      backgroundColor: formData.backgroundColor,
    };

    let updatedRules;

    if (isEditing && ruleToEdit) {
      updatedRules = rules.map((rule) =>
        rule.id === ruleToEdit.id ? newRule : rule
      );
      onCancel();
    } else {
      updatedRules = [...rules, newRule];
    }

    // Update the editor storage with the new rules array
    if (editor) {
      editor.chain().setAiSuggestionRules(updatedRules).loadAiSuggestions();
    }

    // Reset form after adding
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-3 pt-4 border-t">
        <h4 className="font-medium text-sm">
          {isEditing ? 'Edit rule ' : 'Add new rule'}
        </h4>
        <div>
          <Input
            {...register('title')}
            placeholder="Rule title"
            className="text-sm"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>
        <div>
          <Textarea
            {...register('prompt')}
            placeholder="Detailed prompt"
            className="text-sm min-h-[100px]"
          />
          {errors.prompt && (
            <p className="text-red-500 mt-1 text-xs">{errors.prompt.message}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Tag:</span>
          <div className="flex gap-1 flex-wrap">
            {colorOptions.map(({ color, backgroundColor }) => (
              <button
                key={color}
                type="button"
                className={cn(
                  'w-5 h-5 rounded-sm border border-gray-300 hover:border-gray-400 hover:cursor-pointer transition-colors',
                  color === currentColor && 'border-gray-500'
                )}
                style={{ backgroundColor: color }}
                onClick={() => {
                  setValue('color', color);
                  setValue('backgroundColor', backgroundColor);
                }}
              />
            ))}
          </div>
        </div>
        <input type="hidden" {...register('color')} />
        <input type="hidden" {...register('backgroundColor')} />
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t">
        {isEditing ? (
          <Button variant="outline" onClick={onCancel}>
            cancel
          </Button>
        ) : (
          <Button
            type="submit"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        )}
        <Button type="submit" className="h-8">
          {isEditing ? 'Update' : 'Add Rule'}
        </Button>
      </div>
    </form>
  );
};
